const sendToken = (user, statusCode, res) => {
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    // cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    res
        .status(statusCode)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day for access token
        })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for refresh token
        })
        .json({
            message: "User logged in successfully",
            success: true,
            accessToken,
            refreshToken,
            user,
        });
};

module.exports = sendToken;