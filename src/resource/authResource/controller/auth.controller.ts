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
import { extractDbError } from "../../../utils/extract-db-error";
import { extractSessionMeta } from "../../../utils/extract-session-meta";



// handling sql and transforming erros her

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
        } catch (error: any)
        {
            const nomalizedError = extractDbError(error)
            next(nomalizedError)
        }
    }

    handleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const meta = extractSessionMeta(req)
            const data = await this.authService.login(req.body as AuthDto, meta)
            res.cookie('accessToken', data.token, cookieOption)
                .cookie('sessionData', data.refreshToken, cookieOption)
                .cookie('sessionId', data.sessionId, cookieOption)
                .status(201)
                .json(data.user)
        } catch (error)
        {
            next(error)
        }
    }

    handgetLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const loggedinUser = await this.authService.getLoogedInUser(req.user as JwtPayload)

            console.log(loggedinUser)
            res.status(200).json(loggedinUser)
        } catch (error)
        {
            next(error)
        }
    }

    handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
        try
        {

            const { accessToken, refreshToken, sessionId } = await this.authService.refresh(req.cookies.sessionId, req.cookies.refreshToken)
            res.cookie('accessToken', accessToken, cookieOption)
                .cookie('refreshToken', refreshToken, cookieOption)
                .cookie('sessionId', sessionId, cookieOption)
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
                .clearCookie('sessionId', cookieOption)
                .status(200)
                .json({ message: 'Log out successful' })
        } catch (error)
        {
            next(error)
        }
    }

}