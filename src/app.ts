// src/app.ts
import express from "express";
import cors from "cors";
import { AppErr } from "./utils/app-error";
import { ResponseHandler } from "./utils/response-handler";
import cookieParser from "cookie-parser";
import { authRoute } from "./resource/authResource/routes/auth.routes";
import { BASE_URL } from "./constants";
import { db } from "./db";
import { profiles } from "./db/schema";
import { userRoutes } from "./resource/userResource/routes/user.routes";
import { shipmentRoute } from "./resource/shipmentResource/route/shipments.routes";
import { adminRoutes } from "./resource/adminResource/routes/admin.routes";


const app = express();

app.use(cors({
    origin: " http://localhost:8080",
    credentials: true,
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ]
}));

app.use(cookieParser());
app.use(express.json());



app.get("/hello", (req, res) => {
    res.send("API is running...");
});

app.get('/test', async (req, res) => {
    const users = await db.select().from(profiles)
    res.json(users);
})

app.use(BASE_URL, authRoute);
app.use(BASE_URL, userRoutes)
app.use(BASE_URL, shipmentRoute)
app.use(BASE_URL, adminRoutes)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof AppErr)
    {
        return ResponseHandler.error(res, err.message, err.statusCode);
    }
    return ResponseHandler.error(res, `Internal server error and hello ${ err }`, 500);
});


export default app;