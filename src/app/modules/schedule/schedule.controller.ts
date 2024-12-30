import { Request, Response } from "express";
import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleServices } from "./schedule.servie";
import httpStatus from "http-status";
import { AuthUserType } from "../../interface/common";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleServices.createScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(
  async (req: Request & { user?: AuthUserType }, res: Response) => {
    const filter = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await ScheduleServices.getAllSchedulesFromDB(
      filter,
      options,
      user as AuthUserType
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedules fetched successfully",
      data: result,
    });
  }
);
const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrievel successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const ScheduleControllers = {
  createSchedule,
  getAllSchedules,
  getById,
  deleteSchedule,
};
