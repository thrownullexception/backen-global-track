import z, { email, string } from "zod";


export const authSchema = z.object({
    email: z.email({ error: "Invalid email" }),
    password: z.string().min(3).max(10),
})

export const createAccountSchema = authSchema.extend({
    fullName: z.string()
})

export type AuthDto = z.infer<typeof authSchema>
export type createAccountDto = z.infer<typeof createAccountSchema>

