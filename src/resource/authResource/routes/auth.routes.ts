import { Router } from 'express'
import { APP_CONTANTS } from '../../../constants'
import { AuthController } from '../controller/auth.controller'
import { validateIncomingData } from '../../../middleware/validations/validate-incoming.middleware'
import { authSchema, createAccountSchema } from '../../../lib/zod.schema'
import { authGuard } from '../../../middleware/authrorization/auth-guard.middleware'

export const authRoute = Router()

const authController = new AuthController()

authRoute.post(APP_CONTANTS.authEndPoints.login, validateIncomingData(authSchema), authController.handleLogin)
authRoute.post(APP_CONTANTS.authEndPoints.singup, validateIncomingData(createAccountSchema), authController.handleSignUp)
authRoute.post(APP_CONTANTS.authEndPoints.me, authGuard, authController.handgetLoggedInUser)
authRoute.post(APP_CONTANTS.authEndPoints.logot, authGuard, authController.handleLogout)
authRoute.post(APP_CONTANTS.authEndPoints.refresh, authController.handleRefresh)
