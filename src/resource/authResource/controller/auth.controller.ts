import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto, createAccountDto } from "../../../lib/zod.schema";
import { ResponseHandler } from "../../../utils/response-handler";
import { JwtPayload } from "jsonwebtoken";
import { cookieOption } from "../../../constants";





export class AuthController {

    authService: AuthService

    constructor () {
        this.authService = new AuthService()
    }

    // using arrow function o preserve the this key word so it can be safely passed in callbacks
    handleSignUp = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            await this.authService.signUp(req.body as createAccountDto)
            ResponseHandler.success(res, 'Your Sign-up was succesfull', 200)
        } catch (error)
        {
            next(error)
        }
    }

    handleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const { acessToken, refreshToken } = await this.authService.login(req.body as AuthDto)
            res.cookie('accessToken', acessToken, cookieOption)
                .cookie('refreshToken', refreshToken, cookieOption)
                .status(201)
                .json({ message: "login succesfull" })
        } catch (error)
        {
            next(error)
        }
    }

    handgetLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const loggedinUser = await this.authService.getLoogedInUser(req.user as JwtPayload)
            ResponseHandler.success(res, 'logged in user', loggedinUser, 200)
        } catch (error)
        {
            next(error)
        }
    }

    handleLogout = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            res.clearCookie('accessToken', cookieOption)
                .clearCookie('refreshToken', cookieOption)
                .status(200)
                .json({ message: 'Log out successful' })
        } catch (error)
        {
            next(error)
        }
    }

}