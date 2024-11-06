import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/users/user.route";
import { adminRoutes } from "./app/modules/admin/admin.route";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("health care server..");
});

app.use("/api/users", userRoutes);

app.use("/api/admin", adminRoutes);

export default app;
