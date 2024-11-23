import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthUserType } from "../../interface/common";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctorschedule.service";

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

export const DoctorScheduleControllers = {
  insertDoctorSchedule,
};
