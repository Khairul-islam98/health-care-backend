import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await userService.createAdmin(req.body);
  res.send(result);
};
const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.send(users);
};

export const userController = {
  createAdmin,
  getAllUsers,
};
