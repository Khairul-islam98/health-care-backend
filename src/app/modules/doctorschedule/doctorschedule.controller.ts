import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthUserType } from "../../interface/common";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctorschedule.service";
import pick from "../../../shared/pick";

const insertDoctorSchedule = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const result = await DoctorScheduleServices.insertDoctorScheduleIntoDB(
      req.user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);
const getMySchedule = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"]);
    const user = req.user;
    const result = await DoctorScheduleServices.getMySchedule(
      filters,
      options,
      user as AuthUserType
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My schedule fetched successfully",
      data: result,
    });
  }
);
const deleteDoctorSchedule = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleServices.deleteFromDB(
      user as AuthUserType,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My schedule deleted successfully",
      data: result,
    });
  }
);
const getAllSchedule = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "searchTerm",
    "doctorId",
    "startDate",
    "endDate",
    "isBooked",
  ]);
  const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"]);
  const result = await DoctorScheduleServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedule fetched successfully",
    meta: result.meta,
    data: result,
  });
});

export const DoctorScheduleControllers = {
  insertDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
  getAllSchedule,
};
