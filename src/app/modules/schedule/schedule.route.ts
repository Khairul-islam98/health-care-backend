import express from "express";
import { ScheduleControllers } from "./schedule.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), ScheduleControllers.getAllSchedules);

router.post("/", ScheduleControllers.createSchedule);

export const ScheduleRoutes = router;
