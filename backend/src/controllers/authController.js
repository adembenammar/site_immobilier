import { body } from "express-validator";
import { userModel } from "../models/userModel.js";
import { comparePassword, signToken } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const login = async (req, res) => {
  const user = await userModel.findByEmail(req.body.email);

  if (!user || !(await comparePassword(req.body.password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.role !== "admin") {
    throw new AppError("Admin access only", 403);
  }

  const profile = await userModel.findById(user.id);
  const token = signToken(user);

  return res.json({ token, user: profile });
};

export const me = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  return res.json(user);
};
