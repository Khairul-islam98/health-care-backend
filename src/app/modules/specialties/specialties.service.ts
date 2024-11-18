import { Request } from "express";
import { FileType } from "../../interface/file";
import { fileUpload } from "../../helpars/fileUploader";
import prisma from "../../../shared/prisma";

const insertIntoDB = async (req: Request) => {
  const file = req.file as FileType;
  if (file) {
    const uploadToCloudinary = await fileUpload.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

const getAllSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const deleteSpecialtiesFromDB = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};
export const SpecialtiesServices = {
  insertIntoDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
