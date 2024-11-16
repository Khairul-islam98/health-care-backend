import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { AuthUserType } from "../../interface/common";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req);
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
const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctor(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res) => {
  const result = await UserService.createPatient(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await UserService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result,
  });
});
const changeProfileStatus = catchAsync(async (req, res) => {
  const result = await UserService.chageProfileStatus(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile status changed successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const user = req.user;
    const result = await UserService.getMyProfile(user as AuthUserType);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile fetched successfully",
      data: result,
    });
  },
);
const updateMyProfile = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const user = req.user;
    const result = await UserService.updateMyProfile(user as AuthUserType, req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated successfully",
      data: result,
    });
  },
);

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
