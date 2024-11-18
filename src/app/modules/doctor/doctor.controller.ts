import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorFIlterableFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.service";
import httpStatus from "http-status";

const getAllDoctor = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFIlterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorServices.getAllDoctorFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: result,
  });
});
const getDoctorById = catchAsync(async (req, res) => {
  const doctor = await DoctorServices.getDoctorById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: doctor,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.updateDoctorInto(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});
const deleteDoctor = catchAsync(async (req, res) => {
  const result = await DoctorServices.doctorDeleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});
const softDelete = catchAsync(async (req, res) => {
  const result = await DoctorServices.softDeleteDoctorFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorControllera = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  softDelete,
};
