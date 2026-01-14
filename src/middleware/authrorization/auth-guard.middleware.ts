import { NextFunction, Request, Response } from "express";
import { UnAuthorisedRequestError } from "../../utils/app-error";
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppConfig from "../../config.ts/config";


declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}



export function authGuard (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken


    if (!token) next(new UnAuthorisedRequestError())


    try
    {
        const decoded = jwt.verify(token, AppConfig.ACCESS_SECRET);
        req.user = decoded as JwtPayload

        console.log(req.user)
        next()
    } catch (error: any)
    {
        next(error)
    }
}