import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFromDb);
router.get("/:id", AdminController.getById);
router.patch("/:id", AdminController.update);
router.delete("/:id", AdminController.deleteById);
router.delete("/soft/:id", AdminController.softDelete);

export const AdminRoutes = router;
