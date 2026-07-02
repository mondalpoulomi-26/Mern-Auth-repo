import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            });
        }

        const tokenDecode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (tokenDecode.userId) {
            req.userId = tokenDecode.userId;
            next();
        } else {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;