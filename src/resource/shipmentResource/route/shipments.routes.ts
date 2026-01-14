import { Router } from "express";
import { APP_CONTANTS } from "../../../constants";
import { authGuard } from "../../../middleware/authrorization/auth-guard.middleware";
import { ShipController } from "../controller/shipment.controller";
import { validateIncomingData } from "../../../middleware/validations/validate-incoming.middleware";
import { createShipmentSchema, ListOFShipmentSchema } from "../../../lib/zod.schema";

export const shipmentRoute = Router()

const shipmentController = new ShipController()

shipmentRoute.get(APP_CONTANTS.shipmentEndPoints.shipment, authGuard, shipmentController.handleGetUserShipment)
shipmentRoute.get(APP_CONTANTS.shipmentEndPoints.shipmentByTrackingNumber, authGuard, shipmentController.handleGetUserShipmentByTrackingNumber)

shipmentRoute.post(APP_CONTANTS.shipmentEndPoints.createShipments, authGuard, validateIncomingData(createShipmentSchema), shipmentController.handleCreateShipment)
shipmentRoute.post(APP_CONTANTS.shipmentEndPoints.createShipmentItems, authGuard, shipmentController.handleCreateShipmentItem)


