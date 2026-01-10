import { AuthDto, createAccountDto } from "../../../lib/zod.schema";
import { UserRepository } from "../../userResource/repository/user.repository";
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { UnAuthorisedRequestError } from "../../../utils/app-error";
import { jwtHandler } from "../../../utils/Jwt-handle";
import { JwtPayload } from "jsonwebtoken";


// TODO CREATE USER AND LOGIN USER AND LOGOUT USE WITH COOKIES. AND MIDDLEWARE FOR VALIDATION,  ROLE AND AUTHGUARD

// could have user email but decided to useId
export class AuthService {
    userRepository: UserRepository

    constructor () {
        this.userRepository = new UserRepository()
    }

    async signUp (userInfo: createAccountDto) {

        const { email, password, fullName } = userInfo
        const userId = uuidv4()

        const hadPassword = await bcrypt.hash(password, 10)
        this.userRepository.createUser({
            id: userId,
            email,
            password: hadPassword,
            fullName: fullName,
        })
        return
    }
    async login (authDto: AuthDto) {
        const { email, password } = authDto
        const userFound = await this.userRepository.findUserByEmail(email)

        if (!userFound || !(await bcrypt.compare(password, userFound.password)))
            throw new UnAuthorisedRequestError('invalid credentials')

        const token = jwtHandler.generateToken(userFound.id)
        return token
    }

    async logOut (payload: JwtPayload) {

    }
    async getLoogedInUser (userPayload: JwtPayload) {
        const { id } = userPayload
        const userFound = await this.userRepository.findUserById(id)
        if (!userFound) throw new UnAuthorisedRequestError()
        return userFound
    }
}