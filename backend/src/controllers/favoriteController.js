import { body } from "express-validator";
import { favoriteModel } from "../models/favoriteModel.js";

export const favoriteValidation = [
  body("propertyId").isInt({ min: 1 }).withMessage("Property id is required")
];

export const getFavorites = async (req, res) => {
  const favorites = await favoriteModel.listByUser(req.user.id);
  return res.json(favorites);
};

export const toggleFavorite = async (req, res) => {
  const result = await favoriteModel.toggle(req.user.id, req.body.propertyId);
  return res.json(result);
};
