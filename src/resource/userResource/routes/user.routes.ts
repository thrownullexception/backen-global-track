import { Router } from "express";
import { APP_CONTANTS } from "../../../constants";
import { authGuard } from "../../../middleware/authrorization/auth-guard.middleware";
import { UserController } from "../controller/user.controlle";

export const userRoutes = Router()

const userController = new UserController()

userRoutes.get(APP_CONTANTS.userEndPoints.profileDetails, authGuard, userController.handleLoadProfile)
userRoutes.put(APP_CONTANTS.userEndPoints.profileUpdate, authGuard, userController.handleUpdateProfile)