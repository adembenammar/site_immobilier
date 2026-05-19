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
  if (!property) throw new AppError("Property not found", 404);
  return res.json(property);
};

/* ── Helper: convert processed file path → /uploads/<filename> URL ── */
const toImageUrl = (filePath) => {
  const filename = path.basename(filePath);
  return `/uploads/${filename}`;
};

export const createProperty = async (req, res) => {
  const property = await propertyModel.create(req.body);

  if (req.files?.length) {
    // Process sequentially so sort_order reflects upload order
    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      const finalPath = await processImage(file.path);
      await propertyModel.addImage(
        property.id,
        toImageUrl(finalPath),
        index === 0,   // first image is cover
        index          // sort_order
      );
    }
  }

  const completeProperty = await propertyModel.findById(property.id);
  return res.status(201).json(completeProperty);
};

export const updateProperty = async (req, res) => {
  const current = await propertyModel.findById(req.params.id);
  if (!current) throw new AppError("Property not found", 404);

  await propertyModel.update(req.params.id, req.body);

  if (req.files?.length) {
    // Use current cover state (before update) to decide if new images need a cover
    const hasCover = Boolean(current.cover_image);
    const existingCount = current.images?.length ?? 0;

    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      const finalPath = await processImage(file.path);
      await propertyModel.addImage(
        current.id,
        toImageUrl(finalPath),
        index === 0 && !hasCover,  // set cover only if none exists yet
        existingCount + index      // sort_order after existing images
      );
    }
  }

  const completeProperty = await propertyModel.findById(req.params.id);
  return res.json(completeProperty);
};

export const deleteProperty = async (req, res) => {
  const current = await propertyModel.findById(req.params.id);
  if (!current) throw new AppError("Property not found", 404);

  await propertyModel.remove(req.params.id);
  return res.status(204).send();
};

export const deleteImage = async (req, res) => {
  // Verify image belongs to this property before deleting
  const image = await propertyModel.findImageById(req.params.imageId);
  if (!image) throw new AppError("Image not found", 404);
  if (String(image.property_id) !== String(req.params.id)) {
    throw new AppError("Image does not belong to this property", 403);
  }

  await propertyModel.removeImage(req.params.imageId);
  return res.status(204).send();
};

export const setCoverImage = async (req, res) => {
  // Verify image belongs to this property
  const image = await propertyModel.findImageById(req.params.imageId);
  if (!image) throw new AppError("Image not found", 404);
  if (String(image.property_id) !== String(req.params.id)) {
    throw new AppError("Image does not belong to this property", 403);
  }

  await propertyModel.setCoverImage(req.params.id, req.params.imageId);
  const updated = await propertyModel.findById(req.params.id);
  return res.json(updated);
};

export const reorderImages = async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(422).json({ message: "orderedIds must be an array" });
  }

  // Verify all images belong to this property
  const images = await propertyModel.findImagesByPropertyId(req.params.id);
  const validIds = new Set(images.map((img) => String(img.id)));
  const invalid = orderedIds.find((id) => !validIds.has(String(id)));
  if (invalid) throw new AppError("One or more image IDs do not belong to this property", 403);

  await Promise.all(
    orderedIds.map((imageId, index) => propertyModel.updateImageOrder(imageId, index))
  );
  return res.json({ ok: true });
};
