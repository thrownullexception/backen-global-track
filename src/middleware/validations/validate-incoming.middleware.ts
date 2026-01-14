import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { BadRequestError } from "../../utils/app-error";

export const validateIncomingData = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const validatedData = schema.safeParse(req.body)

    console.log(validatedData.error)
    if (validatedData.error) throw new BadRequestError(validatedData.error.message)
    req.body = validatedData.data
    next()
}