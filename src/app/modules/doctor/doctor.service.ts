import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpars/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import prisma from "../../../shared/prisma";

const getAllDoctorFromDB = async (filter: any, options: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filter;

  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key],
        mode: "insensitive",
      },
    }));
    andConditions.push(...filterConditions);
  }
  andConditions.push({
    isDeleted: false,
  });
  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getDoctorById = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const updateDoctorInto = async (id: string, payload: any) => {
  const { specialities, ...updateData } = payload;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transicationClient) => {
    await transicationClient.doctor.update({
      where: {
        id,
      },
      data: updateData,
    });
    if (specialities && specialities.length > 0) {
      const doctorSpecialtiesIds = specialities.filter(
        (specialty: { isDeleted: boolean; specialitiesId: string }) =>
          specialty.isDeleted
      );
      for (const specialty of doctorSpecialtiesIds) {
        await transicationClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }
      const createSpecialtiesIds = specialities.filter(
        (specialty: { isDeleted: boolean; specialitiesId: string }) =>
          !specialty.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await transicationClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const doctorDeleteFromDB = async (id: string): Promise<Doctor | null> => {
  return await prisma.$transaction(async (transicationClient) => {
    const deleteDoctor = await transicationClient.doctor.delete({
      where: {
        id,
      },
    });
    await transicationClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });
    return deleteDoctor;
  });
};
const softDeleteDoctorFromDB = async (id: string): Promise<Doctor | null> => {
  return await prisma.$transaction(async (transicationClient) => {
    const deleteDoctor = await transicationClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transicationClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deleteDoctor;
  });
};

export const DoctorServices = {
  getAllDoctorFromDB,
  getDoctorById,
  updateDoctorInto,
  doctorDeleteFromDB,
  softDeleteDoctorFromDB,
};
