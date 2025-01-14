import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.service";
import httpStatus from "http-status";

const getAllPatient = catchAsync(async (req, res) => {
  const filter = pick(req.query, patientFilterableFields);
  const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PatientServices.getAllPatientFromDB(filter, option);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All patients fetched successfully",
    data: result,
  });
});

const getPatientById = catchAsync(async (req, res) => {
  const result = await PatientServices.getPatientByIdIntoDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient fetched successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.updatePatientIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});
const deletePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.deletePatientIntoDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});
const softDelete = catchAsync(async (req, res) => {
  const result = await PatientServices.softDeletePatientIntoDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

export const PatientControllers = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  softDelete,
};
