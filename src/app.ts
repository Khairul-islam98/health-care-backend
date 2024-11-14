import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/errors/not-found";
import router from "./app/routes";

const app: Application = express();
app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("health care server..");
});

app.use("/api/v1", router);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
