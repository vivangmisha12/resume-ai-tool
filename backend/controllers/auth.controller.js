const userModel = require("../models/user.model");
const sendToken = require("../utils/jwtToken");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        // user already exists or not
        const emailExists = await userModel.findOne({ email: email });
        if (emailExists) {
            res.status(400).json({
                message: "User email already exists!",
                success: false
            })
        }

        const newUser = new userModel({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            success: true,
            data: newUser
        });

    } catch (error) {
        return new Error("Internal server error", 500);
    }
}

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token missing" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const accessToken = user.getAccessToken();

        // Optional: Set the new access token in the cookie as well
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken,
        });
    } catch (err) {
        res.status(401).json({ success: false, message: "Token expired or invalid" });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Please provide email and password",
                success: false
            })
        }

        // user already exists or not
        const user = await userModel.findOne({ email: email });
        if (!user) {
            res.status(400).json({
                message: "Invalid credentials!",
                success: false
            })
        }

        const comparePassword = await user.comparePassword(password);
        if (!comparePassword) {
            res.status(400).json({
                message: "Invalid credentials!",
                success: false
            })
        }

        sendToken(user, 200, res);

    } catch (error) {
        return new Error("Internal server error", 500);
    }
}

const getUser = async(req, res, next) => {
    try {
        // console.log(req.user);
        const user = await userModel.findById(req.user._id).select("-password -__v");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        console.log("yy",user);
        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            data: user
        });
    } catch (error) {
        return new Error("Internal server error", 500);
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "none",
            secure: true,
        });

        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "none",
            secure: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};


module.exports = { register, login, refresh, getUser, logout };