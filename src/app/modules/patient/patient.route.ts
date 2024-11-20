import express from "express";
import { PatientControllers } from "./patient.controller";

const router = express.Router();

router.get("/", PatientControllers.getAllPatient);
router.get("/:id", PatientControllers.getPatientById);
router.patch("/:id", PatientControllers.updatePatient);
router.delete("/:id", PatientControllers.deletePatient);
router.delete("/soft/:id", PatientControllers.softDelete);

export const PatientRoutes = router;
