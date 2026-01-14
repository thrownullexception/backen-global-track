import z, { boolean, email, string } from "zod";
import { shipmentStatus } from "../db/schema";


type TProfileData = {

}



export const UpdateProfileSchema = z.object({
    email: z.email().optional(),
    password: z.string().optional(),
    id: z.string().optional(),
    full_name: z.string().optional(),
    phone: z.string().optional(),
    company_name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    avatar_url: z.string().optional(),
    partner_code: z.string().optional(),
    is_active: z.boolean().optional(),
    updated_at: z.boolean().optional()
})

export const createShipmentSchema = z.object({
    senderName: z.string(),
    senderPhone: z.string(),
    senderEmail: z.email(),
    senderAddress: z.string(),
    senderCity: z.string(),
    receiverName: z.string(),
    receiverPhone: z.string(),
    receiverEmail: z.email(),
    receiverAddress: z.string(),
    receiverCity: z.string(),
    totalWeightKg: z.number(),
    declaredValueNgn: z.number(),
    shippingCostNgn: z.number(),
    insuranceCost: z.number(),
    totalCostNgn: z.number(),
    specialInstructions: z.string().nullable(),
    isFragile: z.boolean(),
    requiresInsurance: z.boolean(),
    status: z.enum(shipmentStatus)
})

const ShipmentItemSchema = z.object({
    shipmentId: z.string(),
    description: z.string(),
    quantity: z.number(),
    weightKg: z.number(),
    declaredValueNgn: z.number(),
})

export const ListOFShipmentSchema = z.array(ShipmentItemSchema)


export const authSchema = z.object({
    email: z.email({ error: "Invalid email" }),
    password: z.string().min(3).max(10),
})

export const createAccountSchema = authSchema.extend({
    fullName: z.string()
})



export type AuthDto = z.infer<typeof authSchema>
export type createAccountDto = z.infer<typeof createAccountSchema>
export type createShipmentDto = z.infer<typeof createShipmentSchema>
export type createShipmentItemsDto = z.infer<typeof ListOFShipmentSchema>
export type shipmentItemDto = z.infer<typeof ShipmentItemSchema>