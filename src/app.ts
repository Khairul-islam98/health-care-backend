import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/users/user.route";
import { adminRoutes } from "./app/modules/admin/admin.route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/errors/not-found";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("health care server..");
});

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;
