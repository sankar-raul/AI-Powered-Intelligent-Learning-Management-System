import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors"
import appConfig from "@/config/config.js";
import { connectDB } from "./config/dbConnector.js";
const app = express()

;(async () => {
    await connectDB();
})()
app.use(express.json())
app.use(helmet())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ok: 'jo'})
})

app.listen(appConfig.PORT, () => {
    console.log(`http://127.0.0.1:${appConfig.PORT}`)
})