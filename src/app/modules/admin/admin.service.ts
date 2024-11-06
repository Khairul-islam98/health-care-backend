import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (params: any, options: any) => {
  const adminSearchableFields = ["name", "email"];

  const { searchTerm, ...filter } = params;
  const { page, limit } = options;
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

  const whereCondition: Prisma.AdminWhereInput = { AND: andConditons };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: Number(page - 1) * limit,
    take: Number(limit),
  });
  return result;
};

export const adminService = {
  getAllFromDB,
};
