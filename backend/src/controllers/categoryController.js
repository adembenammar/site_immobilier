import { body, param } from "express-validator";
import { categoryModel } from "../models/categoryModel.js";

export const categoryValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("slug").trim().notEmpty().withMessage("Slug is required")
];

export const categoryIdValidation = [param("id").isInt({ min: 1 }).withMessage("Invalid category id")];

export const listCategories = async (req, res) => {
  const categories = await categoryModel.list();
  return res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = await categoryModel.create(req.body);
  return res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await categoryModel.update(req.params.id, req.body);
  return res.json(category);
};

export const deleteCategory = async (req, res) => {
  await categoryModel.remove(req.params.id);
  return res.status(204).send();
};
