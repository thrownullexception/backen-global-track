import { JwtPayload } from "jsonwebtoken";
import { ShipRepository, TShipment, TShipmentItems } from "../repository/shipmentRepository";
import { createShipmentDto, createShipmentItemsDto } from "../../../lib/zod.schema";
import { v4 as uuidv4 } from 'uuid'


export type TDataToInsert = {
    id: string;
    tracking_number: string;
    customer_id: any;
    sender_name: string;
    sender_phone: string;
    sender_email: string;
    sender_address: string;
    sender_city: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_email: string;
    receiver_address: string;
    receiver_city: string;
    total_weight_kg: string;
    declared_value_ngn: string;
    shipping_cost_ngn: string;
    insurance_cost: string;
    total_cost_ngn: string;
    is_fragile: boolean;
    requires_insurance: boolean;
    special_instructions: string | null;
    status: string;
}


export type TShipmentItemsDataToInsert = {
    shipment_id: string;
    description: string;
    quantity: number;
    weight_kg: string;
    declared_value_ngn: string;
}



export class ShipmentService {
    shipmentRepository: ShipRepository

    constructor () {
        this.shipmentRepository = new ShipRepository()
    }

    async getUserShipment (payload: JwtPayload) {
        const { id } = payload
        return await this.shipmentRepository.getUserShipments(id)
    }
    async getShipmentByTrackingNumber (id: string) {
        return await this.shipmentRepository.getShipmentByTrackingNumber(id)
    }

    async createUserShipment (payload: JwtPayload, data: createShipmentDto) {
        const status = data.status as string
        const { id } = payload


        const dataToInsert = {
            id: uuidv4(),
            tracking_number: uuidv4(),
            customer_id: id,
            sender_name: data.senderName,
            sender_phone: data.senderPhone,
            sender_email: data.senderEmail,
            sender_address: data.senderAddress,
            sender_city: data.senderCity,
            receiver_name: data.receiverName,
            receiver_phone: data.receiverPhone,
            receiver_email: data.receiverEmail,
            receiver_address: data.receiverAddress,
            receiver_city: data.receiverCity,
            total_weight_kg: JSON.stringify(data.totalWeightKg),
            declared_value_ngn: JSON.stringify(data.declaredValueNgn),
            shipping_cost_ngn: JSON.stringify(data.shippingCostNgn),
            insurance_cost: JSON.stringify(data.insuranceCost),
            total_cost_ngn: JSON.stringify(data.totalCostNgn),
            is_fragile: data.isFragile,
            requires_insurance: data.requiresInsurance,
            special_instructions: data.specialInstructions,
            status: status,
        }

        return this.shipmentRepository.createShipments(dataToInsert)
    }

    async createShipmentItems (data: createShipmentItemsDto) {
        console.log(data)

        data.forEach((data) => {
            const dataToInsert = {
                shipment_id: data.shipmentId,
                description: data.description,
                quantity: data.quantity,
                weight_kg: JSON.stringify(data.weightKg),
                declared_value_ngn: JSON.stringify(data.declaredValueNgn)
            }

            this.shipmentRepository.createShipmentItems(dataToInsert).then((r) => r)
        })

    }
}