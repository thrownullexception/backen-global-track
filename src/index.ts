// src/index.ts
import express from "express";
import cors from "cors";
import AppConfig from "./config.ts/config";


const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("Backend is live"));

const port = Number(AppConfig.port);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${ port }`);
});
