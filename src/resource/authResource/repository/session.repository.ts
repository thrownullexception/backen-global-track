import { and, eq, InferInsertModel, isNull } from "drizzle-orm";
import { db } from "../../../db";
import { sessions } from "../../../db/schema";
import { v4 as uuidv4 } from 'uuid'



export type SessionDto = {
    user_id: string;
    refresh_token_hash: string;
    expires_at: Date;
    created_at?: Date | null | undefined;
    user_agent?: string | null | undefined;
    ip_address?: string | null | undefined;
    revoked_at?: Date | null | undefined;
}

export class SesssionRepository {
    db: typeof db

    constructor () {
        this.db = db
    }

    async createSession (newSession: SessionDto) {
        const id = uuidv4()
        await this.db.insert(sessions).values({ id, ...newSession })
        return id

    }
    async findValidSession (id: string) {
        const validSession = await this.db.select().from(sessions).where(
            and(
                eq(sessions.id, id),
                isNull(sessions.revoked_at)
            )
        ).limit(1);

        return validSession[ 0 ] || null;
    }
    async revokeSession (id: string) {
        await this.db
            .update(sessions)
            .set({ revoked_at: new Date() })
            .where(eq(sessions.id, id));
    }

    async revokeAllUserSessions (userId: string) {
        await this.db
            .update(sessions)
            .set({ revoked_at: new Date() })
            .where(eq(sessions.user_id, userId));
    }
}