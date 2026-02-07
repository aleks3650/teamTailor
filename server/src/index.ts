import express from "express";
import { env } from "./config/env.js";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/candidates", (req, res) => {
    res.send({ message: "Candidates test 1,2,3" });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});