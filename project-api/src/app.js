import express from "express";
import router from "./api/index.js";
import cors from "cors";
const app = express();

app.use(cors())

export default app;