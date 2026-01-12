import { getClientIp } from "./get-client-ip"
import { Request } from "express"

export const extractSessionMeta = (req: Request) => {
    return {
        ip: getClientIp(req),
        userAgent: req.headers[ "user-agent" ] || null,
    }
}