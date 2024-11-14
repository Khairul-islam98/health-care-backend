import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import sendEmail from "../../utils/sendEmail";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "password is incorrect");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "adjdjfdkfjdkf");
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changepassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );
  const resetPassUrl =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
  await sendEmail(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassUrl}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );
  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }
  const password = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changepassword,
  forgotPassword,
  resetPassword,
};
