import { AuthDto, createAccountDto } from "../../../lib/zod.schema";
import { UserRepository } from "../../userResource/repository/user.repository";
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { UnAuthorisedRequestError } from "../../../utils/app-error";
import { jwtHandler } from "../../../utils/Jwt-handle";
import { JwtPayload } from "jsonwebtoken";
import { SesssionRepository } from "../repository/session.repository";


// TODO CREATE USER AND LOGIN USER AND LOGOUT USE WITH COOKIES. AND MIDDLEWARE FOR VALIDATION,  ROLE AND AUTHGUARD

// could have user email but decided to useId

type MetaData = {
    ip: string | null,
    userAgent: string | null,
}
export class AuthService {
    userRepository: UserRepository
    sessionRepository: SesssionRepository

    constructor () {
        this.userRepository = new UserRepository()
        this.sessionRepository = new SesssionRepository()
    }

    async signUp (userInfo: createAccountDto) {

        const { email, password, fullName } = userInfo
        const userId = uuidv4()

        const hadPassword = await bcrypt.hash(password, 10)

        await this.userRepository.createUser({
            id: userId,
            email,
            password: hadPassword,
            fullName: fullName,
        })

        await this.userRepository.defaultRole(userId)
        return
    }
    async login (authDto: AuthDto, meta: MetaData) {
        const { email, password } = authDto
        const userFound = await this.userRepository.findUserByEmail(email)



        if (!userFound) throw new UnAuthorisedRequestError('invalid credentials')

        const roles = await this.userRepository.getUserRoles(userFound.id);
        if (!roles) throw new UnAuthorisedRequestError('User has no roles assigned')

        const isPasswordMatch = await bcrypt.compare(password, userFound.password)

        if (!isPasswordMatch)
            throw new UnAuthorisedRequestError('invalid credentials')



        const token = jwtHandler.generateToken(userFound.id)
        const refreshToken = jwtHandler.generateRefreshToken()


        const sessionId = await this.sessionRepository.createSession({
            user_id: userFound.id,
            refresh_token_hash: jwtHandler.hashToken(refreshToken),
            ip_address: meta.ip,
            user_agent: meta.userAgent,
            expires_at: jwtHandler.refreshExpiry(),
        })

        return {
            token,
            refreshToken,
            sessionId,
            user: { ...roles, ...userFound }
        }
    }


    async getLoogedInUser (userPayload: JwtPayload) {
        const { id } = userPayload
        const user = await this.userRepository.findUserById(id)
        const roles = await this.userRepository.getUserRoles(id);
        if (!user || !roles) throw new UnAuthorisedRequestError()


        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: roles.role,
        };
    }

    async refresh (sessionId: string, refreshToken: string) {
        const session = await this.sessionRepository.findValidSession(sessionId)
        if (!session) throw new UnAuthorisedRequestError('Invalid session')

        if (session.expires_at < new Date())
        {
            await this.sessionRepository.revokeSession(session.id)
            throw new UnAuthorisedRequestError('Session expired')
        }
        const incomingHash = jwtHandler.hashToken(refreshToken)
        if (incomingHash !== session.refresh_token_hash)
        {
            await this.sessionRepository.revokeSession(session.id)
            throw new UnAuthorisedRequestError('Invalid refresh token')
        }
        const newAccessToken = jwtHandler.generateToken(session.user_id)
        const newRefreshToken = jwtHandler.generateRefreshToken()

        session.refresh_token_hash = jwtHandler.hashToken(newRefreshToken)
        session.expires_at = jwtHandler.refreshExpiry()

        const newSessionId = await this.sessionRepository.createSession({
            user_id: session.user_id,
            refresh_token_hash: session.refresh_token_hash,
            ip_address: session.ip_address,
            user_agent: session.user_agent,
            expires_at: session.expires_at,
        })

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionId: newSessionId
        }
    }


    async logout (sessionId: string) {
        await this.sessionRepository.revokeSession(sessionId);
    }

    async logoutAll (userId: string) {
        await this.sessionRepository.revokeAllUserSessions(userId);
    }
}