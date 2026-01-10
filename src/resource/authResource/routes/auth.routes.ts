import { Router } from 'express'
import { APP_CONTANTS } from '../../../constants'

const authRoute = Router()


authRoute.post(APP_CONTANTS.authEndPoints.login)
authRoute.post(APP_CONTANTS.authEndPoints.singup)
authRoute.post(APP_CONTANTS.authEndPoints.logut)
authRoute.post(APP_CONTANTS.authEndPoints.me)
authRoute.post(APP_CONTANTS.authEndPoints.refresh)
