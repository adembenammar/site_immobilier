import { Router } from "express";
import { favoriteValidation, getFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getFavorites));
router.post("/toggle", authenticate, favoriteValidation, validate, asyncHandler(toggleFavorite));

export default router;
