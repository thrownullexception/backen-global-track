import jwt from 'jsonwebtoken'
import AppConfig from '../config.ts/config'
import crypto from 'crypto'

export const jwtHandler = {
    generateToken: (id: string) => {
        return jwt.sign({ id }, AppConfig.ACCESS_SECRET, { expiresIn: '15m' })

    },
    verify: (token: string) => {
        const decoded = jwt.verify(token, AppConfig.ACCESS_SECRET);
        return decoded;
    },
    generateRefreshToken: () => {
        return crypto.randomBytes(64).toString('hex')
    },
    hashToken (token: string) {
        return crypto.createHash('sha256').update(token).digest('hex');
    },
    refreshExpiry () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
}