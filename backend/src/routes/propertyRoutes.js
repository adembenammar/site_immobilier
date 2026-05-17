import { Router } from "express";
import {
  createProperty,
  deleteImage,
  deleteProperty,
  getFeaturedProperties,
  getProperty,
  listProperties,
  propertyIdValidation,
  propertyValidation,
  reorderImages,
  setCoverImage,
  updateProperty
} from "../controllers/propertyController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listProperties));
router.get("/featured", asyncHandler(getFeaturedProperties));
router.get("/:id", propertyIdValidation, validate, asyncHandler(getProperty));
router.post(
  "/",
  authenticate,
  authorize("admin", "agent"),
  upload.array("images", 8),
  propertyValidation,
  validate,
  asyncHandler(createProperty)
);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "agent"),
  upload.array("images", 8),
  propertyIdValidation,
  propertyValidation,
  validate,
  asyncHandler(updateProperty)
);
router.delete("/:id", authenticate, authorize("admin", "agent"), propertyIdValidation, validate, asyncHandler(deleteProperty));
router.delete("/:id/images/:imageId", authenticate, authorize("admin", "agent"), asyncHandler(deleteImage));
router.put("/:id/images/:imageId/cover", authenticate, authorize("admin", "agent"), asyncHandler(setCoverImage));
router.put("/:id/images/reorder", authenticate, authorize("admin", "agent"), asyncHandler(reorderImages));

export default router;
