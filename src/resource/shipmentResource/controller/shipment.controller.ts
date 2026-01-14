import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ShipmentService } from "./shipment.service";
import { createShipmentDto, createShipmentItemsDto } from "../../../lib/zod.schema";

export class ShipController {
    shipmentService: ShipmentService

    constructor () {
        this.shipmentService = new ShipmentService()
    }

    handleGetUserShipment = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const shipmentDetails = await this.shipmentService.getUserShipment(req.user as JwtPayload)
            res.status(200).json(shipmentDetails)
        } catch (error)
        {

            next(error)
        }
    }

    handleGetUserShipmentByTrackingNumber = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const { id } = req.params
            console.log(id)
            const shipmentDetails = await this.shipmentService.getShipmentByTrackingNumber(id)
            res.status(200).json(shipmentDetails)
        } catch (error)
        {

            next(error)
        }
    }
    handleCreateShipment = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const shipment = await this.shipmentService.createUserShipment(req.user as JwtPayload, req.body as createShipmentDto)
            res.status(201).json(shipment)
        } catch (error)
        {
            console.log(error)
        }
    }
    handleCreateShipmentItem = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            console.log(req.body)
            await this.shipmentService.createShipmentItems(req.body as createShipmentItemsDto)
            res.status(201).json({ message: 'shipement created successfully' })
        } catch (error)
        {
            console.log(error)
            next(error)
        }
    }
}