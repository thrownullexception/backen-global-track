import jwt from 'jsonwebtoken'
import AppConfig from '../config.ts/config'

export const jwtHandler = {
    generateToken: (id: string) => {
        const acessToken = jwt.sign({ id }, AppConfig.JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id }, AppConfig.JWT_SECRET, { expiresIn: '7d', algorithm: "HS384" })
        return { refreshToken, acessToken }
    },
    verify: (token: string) => {
        const decode = jwt.verify(token, AppConfig.JWT_SECRET)
        return decode
    }
}