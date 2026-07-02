import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";


const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  // Step:
  // 1 = Email Form
  // 2 = OTP Form
  // 3 = New Password Form
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const inputRefs = useRef([]);

  // Move cursor automatically
  const handleInput = (e, index) => {
    if (
      e.target.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Move back on Backspace
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text").slice(0, 6);
    const chars = paste.split("");

    chars.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Email Submit
  const onSubmitEmail = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/auth/send-reset-otp`,
      { email }
    );

    if (data.success) {
      toast.success(data.message);
      setStep(2);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  // OTP Submit
 const onSubmitOTP = async (e) => {
  e.preventDefault();

  const otp = inputRefs.current.map((input) => input.value).join("");

  if (otp.length !== 6) {
    return toast.error("Please enter a valid OTP");
  }

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/auth/verify-reset-otp`,
      {
        email,
        otp,
      }
    );

    if (data.success) {
      toast.success(data.message);
      setStep(3);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

// Password Submit
const onSubmitPassword = (e) => {
  e.preventDefault();

  console.log(newPassword);

  // Call Reset Password API here

  alert("Password Reset Successfully!");

  navigate("/login");   // Change to "/" if your login page is the home page
};
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#dbe7ff] via-[#c8b9ff] to-[#dba9ff]">

      {/* Background */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>

      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 sm:left-20 w-32 cursor-pointer"
      />

      {/* -------------------- EMAIL FORM -------------------- */}
      {step === 1 && (
        <form
          onSubmit={onSubmitEmail}
          className="w-[380px] bg-[#111827] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] px-8 py-8"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            Reset Password
          </h1>

          <p className="text-center text-indigo-300 mt-3 mb-7 text-sm">
            Enter your registered email address
          </p>

          <div className="flex items-center h-12 bg-[#343b5b] rounded-full px-5">
            <img
              src={assets.mail_icon}
              alt=""
              className="w-5 h-5 opacity-70"
            />

            <input
              type="email"
              placeholder="Email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 ml-4 bg-transparent outline-none text-white text-sm placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-7 rounded-full bg-gradient-to-r from-[#5B63FF] via-[#7646FF] to-[#B31EFF] text-white font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Send OTP
          </button>
        </form>
      )}


            {/* -------------------- OTP FORM -------------------- */}
      {step === 2 && (
        <form
          onSubmit={onSubmitOTP}
          className="w-[380px] bg-[#111827] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] px-8 py-8"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            Verify OTP
          </h1>

          <p className="text-center text-indigo-300 mt-3 mb-7 text-sm">
            Enter the 6-digit OTP sent to your email
          </p>

          <div
            className="flex justify-between mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 rounded-lg bg-[#343b5b] text-white text-center text-xl font-semibold outline-none border border-transparent focus:border-purple-500"
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#5B63FF] via-[#7646FF] to-[#B31EFF] text-white font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full mt-4 text-sm text-indigo-300 hover:text-white transition"
          >
            ← Back
          </button>
        </form>
      )}


            {/* -------------------- NEW PASSWORD FORM -------------------- */}
            {step === 3 && (
        <form
          onSubmit={onSubmitPassword}
          className="w-[380px] bg-[#111827] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] px-8 py-8"
        >
          <h1 className="text-3xl font-bold text-white text-center">
            New Password
          </h1>

          <p className="text-center text-indigo-300 mt-3 mb-7 text-sm">
            Enter your new password below
          </p>

          <div className="flex items-center h-12 bg-[#343b5b] rounded-full px-5">
            <img
              src={assets.lock_icon}
              alt="lock"
              className="w-5 h-5 opacity-70"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="flex-1 ml-4 bg-transparent outline-none text-white text-sm placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-7 rounded-full bg-gradient-to-r from-[#5B63FF] via-[#7646FF] to-[#B31EFF] text-white font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full mt-4 text-sm text-indigo-300 hover:text-white transition"
          >
            ← Back
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;