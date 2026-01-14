import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { db } from "../../../db";
import { partner_commissions, payments, profiles, shipments, user_roles } from "../../../db/schema";
import { v4 as uuidv4 } from 'uuid'
    ;



type UserDto = {
    id: string,
    fullName: string,
    email: string,
    password: string,
}

export type TProfileData = InferInsertModel<typeof profiles>

export class AdminRepository {
    db: typeof db

    constructor () {
        this.db = db
    }



    async getAllUsersByRole (usersRole: 'customer' | 'partner') {
        const usersByRole = await this.db
            .select().from(user_roles).where(eq(user_roles, usersRole))
        return usersByRole ?? null
    }

    async getAllUserProfile () {
        const users = await this.db.select().from(profiles)
        return users[ 0 ] ?? null
    }

    async getAllShipments () {
        const allShipments = await this.db.select().from(shipments)
        return allShipments ?? null
    }

    async getAllPayment () {
        const getAllPayment = await this.db.select({ amount: payments.amount, staus: payments.status }).from(payments)
        return getAllPayment ?? null
    }
    async getProfilesForSpecificUser (id: string[]) {
        const specificProfiles = await this.db.select().from(profiles).where(inArray(profiles.id, id))
        return specificProfiles ?? null
    }

    async getPartnersCommision (id: string[]) {
        const commisions = await this.db.select().from(partner_commissions).where(inArray(partner_commissions.partner_id, id))
        return commisions || null
    }

}