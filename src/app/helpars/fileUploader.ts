import multer from "multer";
import path from "path";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import { FileType, CloudinaryResponseType } from "../interface/file";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name as string,
  api_key: config.cloudinary.api_key as string,
  api_secret: config.cloudinary.api_secret as string,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: FileType
): Promise<CloudinaryResponseType | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: CloudinaryResponseType) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUpload = {
  upload,
  uploadToCloudinary,
};
