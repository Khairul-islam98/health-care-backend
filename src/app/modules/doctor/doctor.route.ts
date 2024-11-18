import express from "express";
import { DoctorControllers } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// task 3
router.get("/", DoctorControllers.getAllDoctor);

//task 4
router.get("/:id", DoctorControllers.getDoctorById);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  DoctorControllers.updateDoctor
);

//task 5
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.deleteDoctor
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.softDelete
);

export const DoctorRoutes = router;
