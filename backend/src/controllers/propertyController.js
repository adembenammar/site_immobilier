import { body, param } from "express-validator";
import path from "node:path";
import { propertyModel } from "../models/propertyModel.js";
import { AppError } from "../utils/AppError.js";
import { processImage } from "../utils/processImage.js";

export const propertyValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("slug").trim().notEmpty().withMessage("Slug is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("price").isNumeric().withMessage("Price must be numeric"),
  body("surface").isInt({ min: 1 }).withMessage("Surface must be a positive integer"),
  body("rooms").isInt({ min: 1 }).withMessage("Rooms must be a positive integer"),
  body("bedrooms").isInt({ min: 0 }).withMessage("Bedrooms must be numeric"),
  body("bathrooms").isInt({ min: 0 }).withMessage("Bathrooms must be numeric"),
  body("categoryId").isInt({ min: 1 }).withMessage("Category is required")
];

export const propertyIdValidation = [param("id").isInt({ min: 1 }).withMessage("Invalid property id")];

export const listProperties = async (req, res) => {
  const properties = await propertyModel.list(req.query);
  return res.json(properties);
};

export const getFeaturedProperties = async (req, res) => {
  const properties = await propertyModel.featured();
  return res.json(properties);
};

export const getProperty = async (req, res) => {
  const property = await propertyModel.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  return res.json(property);
};

export const createProperty = async (req, res) => {
  const property = await propertyModel.create(req.body);

  if (req.files?.length) {
    await Promise.all(
      req.files.map(async (file, index) => {
        await processImage(file.path);
        await propertyModel.addImage(property.id, `/uploads/${file.filename}`, index === 0);
      })
    );
  }

  const completeProperty = await propertyModel.findById(property.id);
  return res.status(201).json(completeProperty);
};

export const updateProperty = async (req, res) => {
  const current = await propertyModel.findById(req.params.id);

  if (!current) {
    throw new AppError("Property not found", 404);
  }

  const property = await propertyModel.update(req.params.id, req.body);

  if (req.files?.length) {
    await Promise.all(
      req.files.map(async (file, index) => {
        await processImage(file.path);
        await propertyModel.addImage(property.id, `/uploads/${file.filename}`, index === 0 && !property.cover_image);
      })
    );
  }

  const completeProperty = await propertyModel.findById(property.id);
  return res.json(completeProperty);
};

export const deleteProperty = async (req, res) => {
  const current = await propertyModel.findById(req.params.id);

  if (!current) {
    throw new AppError("Property not found", 404);
  }

  await propertyModel.remove(req.params.id);
  return res.status(204).send();
};

export const deleteImage = async (req, res) => {
  await propertyModel.removeImage(req.params.imageId);
  return res.status(204).send();
};

export const setCoverImage = async (req, res) => {
  await propertyModel.setCoverImage(req.params.id, req.params.imageId);
  const updated = await propertyModel.findById(req.params.id);
  return res.json(updated);
};

export const reorderImages = async (req, res) => {
  // orderedIds: [id1, id2, id3, ...] in desired display order
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(422).json({ message: "orderedIds must be an array" });
  }
  await Promise.all(
    orderedIds.map((imageId, index) =>
      propertyModel.updateImageOrder(imageId, index)
    )
  );
  return res.json({ ok: true });
};
