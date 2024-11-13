import pick from "../../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";
import httpStatus from "http-status";

const getAllFromDb = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AdminService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getById = catchAsync(async (req, res) => {
  const result = await AdminService.getByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched ById successfully",
    data: result,
  });
});
const update = catchAsync(async (req, res) => {
  const result = await AdminService.updateIntoDB(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data updated successfully",
    data: result,
  });
});
const deleteById = catchAsync(async (req, res) => {
  const result = await AdminService.deleteFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const result = await AdminService.softDeleteFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data soft deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllFromDb,
  getById,
  update,
  deleteById,
  softDelete,
};
