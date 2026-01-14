import { JwtPayload } from "jsonwebtoken";
import { TProfileData, UserRepository } from "../repository/user.repository";


export class UserService {
    userRepository: UserRepository

    constructor () {
        this.userRepository = new UserRepository()
    }

    async getUserProfile (payload: JwtPayload) {
        const { id } = payload
        return await this.userRepository.findUserById(id)
    }
    async updateUserProfile (payload: JwtPayload, profileData: TProfileData) {
        const { id } = payload
        await this.userRepository.updateUserProfile(id, profileData)
    }
}