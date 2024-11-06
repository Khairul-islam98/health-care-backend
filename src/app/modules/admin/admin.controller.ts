import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { ParsedQs } from "qs";

const pick = (obj, keys) => {
  const finalObj = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  console.log(finalObj);
  return finalObj;
};

const adminfilter = ["name", "email", "searchTerm", "contactNumber"];

const getAllFromDb = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminfilter);
    console.log(filter);
    const result = await adminService.getAllFromDB(filter);
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
