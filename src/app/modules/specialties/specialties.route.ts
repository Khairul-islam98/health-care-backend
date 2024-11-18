import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesControllers } from "./specialties.controller";
import { fileUpload } from "../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", SpecialtiesControllers.getAllSpecialties);
router.post(
  "/",
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return SpecialtiesControllers.insertInto(req, res, next);
  }
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesControllers.deleteSpecialties
);

export const SpecialtiesRoutes = router;
