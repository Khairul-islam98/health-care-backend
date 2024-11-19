import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { scheduleServices } from "./schedule.servie";
import httpStatus from "http-status";

const createSchedule = catchAsync(async (req, res) => {
  const result = await scheduleServices.createScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

export const ScheduleControllers = {
  createSchedule,
};
