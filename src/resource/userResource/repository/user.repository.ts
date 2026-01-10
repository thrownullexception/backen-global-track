import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { profiles } from "../../../db/schema";


type UserDto = {
    id: string,
    fullName: string,
    email: string,
    password: string,
}

export class UserRepository {
    db: typeof db

    constructor () {
        this.db = db
    }

    async createUser (userDto: UserDto) {
        return await db.insert(profiles)
            .values({ id: userDto.id, email: userDto.email, password: userDto.password, full_name: userDto.fullName })
    }

    async findUserByEmail (email: string) {
        return await db.select().from(profiles).where(eq(profiles.email, email))
    }
    async findUserById (id: string) {
        return await db.select().from(profiles).where(eq(profiles.id, id))
    }
}