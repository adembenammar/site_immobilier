import { body, param } from "express-validator";
import { userModel } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

export const listUsers = async (req, res) => {
  const users = await userModel.list();
  return res.json(users);
};

export const userRoleValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid user id"),
  body("role").isIn(["admin", "agent", "client"]).withMessage("Invalid role")
];

export const updateUserRole = async (req, res) => {
  const user = await userModel.updateRole(req.params.id, req.body.role);
  if (!user) throw new AppError("User not found", 404);
  return res.json(user);
};
