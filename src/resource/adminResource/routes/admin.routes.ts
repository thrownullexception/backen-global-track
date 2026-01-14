import { Router } from "express";
import { APP_CONTANTS } from "../../../constants";
import { authGuard } from "../../../middleware/authrorization/auth-guard.middleware";
import { AdminController } from "../controllers/admin.controller";
import { checkRole } from "../../../middleware/authrorization/check-role.midlleware";

export const adminRoutes = Router()
const adminController = new AdminController()

adminRoutes.get(APP_CONTANTS.adminEndPoints.allShipments, authGuard, checkRole, adminController.handleGetAllShipment)
adminRoutes.get(APP_CONTANTS.adminEndPoints.partnerDetails, authGuard, checkRole, adminController.handleGetAllPartnerDetails)
adminRoutes.get(APP_CONTANTS.adminEndPoints.paymentDetails, authGuard, checkRole, adminController.handleGetPayment)
