import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as Error)?.name || "Internal server error",
      error: err,
    });
  }
};

export const UserController = {
  createAdmin,
};
