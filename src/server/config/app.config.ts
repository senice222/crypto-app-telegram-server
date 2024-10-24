import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { indexRouter } from "../routes/index.routes";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(indexRouter);

export default app;
