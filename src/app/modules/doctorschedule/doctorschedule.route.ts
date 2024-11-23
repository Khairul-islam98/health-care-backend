import express from "express";
import { DoctorScheduleControllers } from "./doctorschedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.insertDoctorSchedule
);

export const DoctorScheduleRoutes = router;
