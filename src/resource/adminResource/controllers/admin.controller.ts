import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";

export class AdminController {

    adminService: AdminService
    constructor () {
        this.adminService = new AdminService()
    }

    handleGetAllShipment = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const shipmentDetails = await this.adminService.getAllShipments()
            res.status(200).json(shipmentDetails)
        } catch (error)
        {
            next(error)
        }
    }
    handleGetAllPartnerDetails = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const { id } = req.params
            const partnerDetails = await this.adminService.getPaternersDetails(id)
            res.status(200).json(partnerDetails)
        } catch (error)
        {
            next(error)
        }
    }


    handleGetPayment = async (req: Request, res: Response, next: NextFunction) => {
        try
        {
            const paymentDetails = await this.adminService.getAllPayments()
            res.status(200).json(paymentDetails)
        } catch (error)
        {
            next(error)
        }
    }
}