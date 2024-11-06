import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (params: any) => {
  const adminSearchableFields = ["name", "email"];

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
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andConditons };

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });
  return result;
};

export const adminService = {
  getAllFromDB,
};
