import express from 'express'
import * as authController from '../controller/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/login', authController.login)

export { authRouter }