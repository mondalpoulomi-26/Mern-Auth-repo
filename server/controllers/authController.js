import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req,res) => {
      const {name,email,password} = req.body;

      if(!name || !email || !password){
        return res.json({success:false, message:"All fields are required"});

    }
    try{
        const existingUser = await userModel.findOne({email})
        if( existingUser){
               return res.json({success:false, message:"User already exists with this email"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user= new userModel({name,email,password:hashedPassword});
        await user.save();

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //Sending welcome email after successful registration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Apsara",
            text: `Welcome to apsara website.Your account has been created with email id: ${email}`
        };
        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    }catch(error){
        res.json({success:false, message:error.message})
    }
}
export const login = async (req,res) => {
        const {email,password} = req.body;
        if(!email || !password){
            return res.json({success:false, message:'Email and password are required'})
        }
        try{
            console.log("Login email:", email);

const user = await userModel.findOne({ email });

console.log("User found:", user);
            if(!user){
                return res.json({success:false, message:'Invalid email'})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.json({success:false, message:'Invalid password'})
            }
            const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //Sending welcome email after successful login
        
        return res.json({success: true});
        }catch(error){
            res.json({success:false, message:error.message})
        }
}
export const logout =async (req,res) => {
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success:true,message: "Logged out"});
    }catch(error){
         return res.json({success:false, message:error.message});
    }
}
export const sendVerifyOtp = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account Already verified"
            });
        }

        const otp = String(
            Math.floor(100000 + Math.random() * 900000)
        );

        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Password Reset OTP",
    html: PASSWORD_RESET_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email),
};

        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "Verification OTP Sent on Email"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
//Verify the Email using the OTP
export const verifyEmail = async (req, res) => {

    const userId = req.userId;
    const { otp } = req.body;

    if (!otp) {
        return res.json({
            success: false,
            message: 'Missing OTP'
        });
    }

    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

//Check if user is authenticated
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json ({success: true});
    } catch (error) {
        res.json({success: false,message: error.message})
    }
}

//Send Password Reset OTP
export const sendResetOtp = async(req,res) =>{
    const {email}=req.body;
    if(!email){
        return res.json({success: false,message: 'Email is required'})
    }
    try {
        const user =await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message:'User not found'});
        }
        const otp = String(
            Math.floor(100000 + Math.random() * 900000)
        );

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `Your OTP for resetting your password is${otp}.Use this OTP to process with resetting your password.`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        
        
        };


        await transporter.sendMail(mailOption);
        return res.json({success: true,message:'OTP sent to your email'});
    } catch (error) {
        return res.json({success: false,message:error.message});
    }
}


// Verify Reset OTP
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({
            success: false,
            message: "Email and OTP are required"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP Expired"
            });
        }

        return res.json({
            success: true,
            message: "OTP Verified"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};




//Reset User Password
export const resetPassword =async(req,res) =>{
    const{email,otp,newPassword}= req.body;
    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email,OTP and new password are required'});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message:'User not found'});
        }
        if(user.resetOtp === ""|| user.resetOtp !==otp){
            return res.json({success:false,message:'Invalid OTP'});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message:'OTP Expired'});
        }
        const hashedPassword =await bcrypt.hash(newPassword,10);
        user.password =hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt= 0;
        await user.save();

        return res.json({success:true,message:'Password has been reset successfully'});

    } catch (error) {
        return res.json({success: false,message:error.message});
    }
}