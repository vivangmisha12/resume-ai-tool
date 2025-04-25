const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.isAuthenticated = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Refresh the access token to continue" });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

        req.user = await userModel.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
