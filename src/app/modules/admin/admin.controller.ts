import { Request, Response } from "express";

const getAllFromDb = async (req: Request, res: Response) => {
  try {
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
