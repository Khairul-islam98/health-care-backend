import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", userController.createAdmin);
router.get("/", userController.getAllUsers);

export const userRoutes = router;
