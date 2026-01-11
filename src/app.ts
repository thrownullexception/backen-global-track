// src/index.ts
import express from "express";
import cors from "cors";
import { AppErr } from "./utils/app-error";
import { ResponseHandler } from "./utils/response-handler";
import cookieParser from "cookie-parser";
import { authRoute } from "./resource/authResource/routes/auth.routes";


const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ]
}));

app.use(cookieParser());
app.use(express.json());



app.get("/hello", (req, res) => {
    res.send("API is running...");
});
app.use('/api/v1', authRoute);


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof AppErr)
    {
        ResponseHandler.error(res, err.message, err.statusCode);
    }
    return ResponseHandler.error(res, "Internal server error and hello", 500);
});


export default app;