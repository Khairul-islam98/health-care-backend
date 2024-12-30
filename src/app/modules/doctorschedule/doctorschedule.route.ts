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
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleControllers.getAllSchedule
);
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteDoctorSchedule
);

export const DoctorScheduleRoutes = router;
