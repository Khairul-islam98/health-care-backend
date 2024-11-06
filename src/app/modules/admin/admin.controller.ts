import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllFromDb = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllFromDB();
    res.status(200).json({
      success: true,
      message: "Successfully fetched all admins",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: (error as any)?.name || "Internal server error",
      error,
    });
  }
};

export const adminController = {
  getAllFromDb,
};
