import { CookieOptions } from "express"
import { profile } from "node:console"


export const BASE_URL = "/global-tracker/api/v1"

export const APP_CONTANTS = {
    adminEndPoints: {
        allShipments: '/admin/all-shipments',
        partnerDetails: '/admin/partner-details',
        paymentDetails: '/admin/payment-details'
    },
    authEndPoints: {
        login: '/auth/login',
        singup: '/auth/signup',
        logout: '/auth/logout',
        me: '/auth/me',
        refresh: '/auth/refresh'
    },
    userEndPoints: {
        profileDetails: '/profile',
        profileUpdate: '/profile/update'
    },
    shipmentEndPoints: {
        shipment: '/shipment',
        createShipments: '/shipment/create-shipment',
        createShipmentItems: '/shipment/create-shipment-items',
        shipmentByTrackingNumber: "/shipment/:id"
    }

}


export const cookieOption: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 100,
    path: "/"
}