import { Router } from "express";
import {
  categoryIdValidation,
  categoryValidation,
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listCategories));
router.post("/", authenticate, authorize("admin"), categoryValidation, validate, asyncHandler(createCategory));
router.put("/:id", authenticate, authorize("admin"), categoryIdValidation, categoryValidation, validate, asyncHandler(updateCategory));
router.delete("/:id", authenticate, authorize("admin"), categoryIdValidation, validate, asyncHandler(deleteCategory));

export default router;
