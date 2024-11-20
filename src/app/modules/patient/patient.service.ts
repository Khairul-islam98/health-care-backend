import { Patient, Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpars/paginationHelper";
import { patientSearchableFields } from "./patient.constant";
import prisma from "../../../shared/prisma";

const getAllPatientFromDB = async (params: any, option: any) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(option);
  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.PatientWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
          mode: "insensitive",
        },
      })),
    });
  }
  andCondition.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.PatientWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      option.sortBy && option.sortOrder
        ? { [option.sortBy]: option.sortOrder }
        : { createdAt: "desc" },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getPatientByIdIntoDB = async (id: string) => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updatePatientIntoDB = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await prisma.$transaction(async (transactionCilent) => {
    await transactionCilent.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        medicalReport: true,
        patientHealthData: true,
      },
    });
    if (patientHealthData) {
      await transactionCilent.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    if (medicalReport) {
      await transactionCilent.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });
  const result = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const deletePatientIntoDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionCilent) => {
    await transactionCilent.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    await transactionCilent.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletePatient = await transactionCilent.patient.delete({
      where: {
        id,
      },
    });
    await transactionCilent.user.delete({
      where: {
        id: deletePatient.email,
      },
    });
    return deletePatient;
  });
  return result;
};

export const PatientServices = {
  getAllPatientFromDB,
  getPatientByIdIntoDB,
  updatePatientIntoDB,
  deletePatientIntoDB,
};
