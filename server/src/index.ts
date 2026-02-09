import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { candidatesRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/index.js";

const app = express();
app.use(cors());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version
    });
});

app.use("/candidates", candidatesRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});