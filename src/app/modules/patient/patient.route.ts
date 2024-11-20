import express from "express";
import { PatientControllers } from "./patient.controller";

const router = express.Router();

router.get("/", PatientControllers.getAllPatient);
router.get("/:id", PatientControllers.getPatientById);

export const PatientRoutes = router;
