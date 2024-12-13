import { Admin, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../helpars/paginationHelper";
import { adminSearchableFields } from "./admin.constant";

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filter } = params;
  const andConditons: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditons.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filter).length > 0) {
    andConditons.push({
      AND: Object.keys(filter).map((key) => ({
        [key]: {
          equals: filter[key],
          mode: "insensitive",
        },
      })),
    });
  }
  andConditons.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.AdminWhereInput = { AND: andConditons };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: { id },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.delete({
      where: { id },
    });
    await transactionClient.user.delete({
      where: {
        email: adminDeleteData.email,
      },
    });
    return adminDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminDeleteData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeleteData;
  });
  return result;
};
// todo: add other methods

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
