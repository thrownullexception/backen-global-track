import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto, createAccountDto } from "../../../lib/zod.schema";
import { ResponseHandler } from "../../../utils/response-handler";
import { JwtPayload } from "jsonwebtoken";
import { cookieOption } from "../../../constants";
import config from "../../../config.ts/config";
import jwt from "jsonwebtoken";
import { jwtHandler } from "../../../utils/Jwt-handle";
import { UnAuthorisedRequestError } from "../../../utils/app-error";





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
            const { accessToken, refreshToken } = await this.authService.login(req.body as AuthDto)
            res.cookie('accessToken', accessToken, cookieOption)
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

    handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
        const tokenFromClient = req.cookies.refreshToken
        try
        {

            const payLoad = jwt.verify(tokenFromClient, config.JWT_SECRET) as JwtPayload
            const { id } = payLoad
            res.clearCookie('accessToken', cookieOption)
                .clearCookie('refreshToken', cookieOption)

            const { accessToken, refreshToken } = jwtHandler.generateToken(id)

            res.cookie('accessToken', accessToken, cookieOption)
                .cookie('refreshToken', refreshToken, cookieOption)
                .status(200)
                .json({ message: 'refresh successful' })

        } catch (error: any)
        {
            next(new UnAuthorisedRequestError(error))
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