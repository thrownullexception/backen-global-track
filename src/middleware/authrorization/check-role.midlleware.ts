import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../resource/userResource/repository/user.repository";
import { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnAuthorisedRequestError } from "../../utils/app-error";


type TRoles = 'customer' | 'partner' | 'admin_ng' | 'admin_uk'

const userRepository = new UserRepository()

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {


    const { role } = req.query
    const { id } = req.user! as JwtPayload

    try
    {

        const userFound = await userRepository.getUserRoles(id)

        if (!userFound) throw new UnAuthorisedRequestError()
        if (userFound.role !== role) throw new UnAuthorisedRequestError(`You must be a ${ role } to continue this request`)
        next()
    } catch (error)
    {
        next(error)
    }




}