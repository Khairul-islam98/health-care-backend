import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";
import httpStatus from "http-status";

const getAllPatient = catchAsync(async (req, res) => {
  const filter = pick(req.query, patientFilterableFields);
  const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PatientServices.getAllPatientIntoDB(filter, option);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All patients fetched successfully",
    data: result,
  });
});

export const PatientControllers = {
  getAllPatient,
};
