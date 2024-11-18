import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SpecialtiesServices } from "./specialties.service";
import httpStatus from "http-status";

const insertInto = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.insertIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Specialty added successfully",
    data: result,
  });
});
const getAllSpecialties = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.getAllSpecialtiesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties fetched successfully",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req, res) => {
  const result = await SpecialtiesServices.deleteSpecialtiesFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const SpecialtiesControllers = {
  insertInto,
  getAllSpecialties,
  deleteSpecialties,
};
