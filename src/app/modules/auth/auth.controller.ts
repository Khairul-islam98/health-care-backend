import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import { Request } from "express";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const user = req.user;
    const result = await AuthServices.changepassword(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully!",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req, res) => {
  await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent successfully!",
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";
  await AuthServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
