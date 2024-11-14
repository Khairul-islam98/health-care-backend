import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpars/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "password is incorrect");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abdcedf",
    "5m",
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "djfkjfddds",
    "30d",
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
    "abdcedf",
    "5m",
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
