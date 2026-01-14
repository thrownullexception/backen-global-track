import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../../../db";
import { profiles, user_roles } from "../../../db/schema";
import { v4 as uuidv4 } from 'uuid'
    ;



type UserDto = {
    id: string,
    fullName: string,
    email: string,
    password: string,
}

export type TProfileData = InferInsertModel<typeof profiles>

export class UserRepository {
    db: typeof db

    constructor () {
        this.db = db
    }

    async createUser (userDto: UserDto) {
        return await this.db.insert(profiles)
            .values({ id: userDto.id, email: userDto.email, password: userDto.password, full_name: userDto.fullName })
    }

    async findUserByEmail (email: string) {
        const users = await this.db.select().from(profiles).where(eq(profiles.email, email))
        return users[ 0 ] ?? null
    }
    async findUserById (id: string) {
        const users = await this.db
            .select({
                id: profiles.id,
                email: profiles.email, fullName: profiles.full_name,
                phone: profiles.phone, city: profiles.city,
                country: profiles.country, address: profiles.address,
                avatarUrl: profiles.avatar_url, companyName: profiles.company_name
            }).from(profiles).where(eq(profiles.id, id))
        return users[ 0 ] ?? null
    }
    async getUserRoles (id: string) {
        const userRole = await this.db.select({ role: user_roles.role }).from(user_roles).where(eq(user_roles.user_id, id))
        return userRole[ 0 ] ?? null
    }
    async defaultRole (userId: string) {
        await this.db.insert(user_roles).values({ user_id: userId, role: 'admin_ng', id: uuidv4() })
    }

    async updateUserProfile (userId: string, profileData: TProfileData) {
        await this.db.update(profiles).set(profileData).where(eq(profiles.id, userId))
    }
}