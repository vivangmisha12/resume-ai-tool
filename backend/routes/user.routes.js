const express = require('express');
const { register, login, refresh, getUser } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const userRouter = express.Router();

userRouter.post("/auth/register", register);

userRouter.post("/auth/login", login);

userRouter.get("/auth/refresh", refresh);

userRouter.get("/auth/me", isAuthenticated, getUser)

module.exports = userRouter;