import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { login, loginValidation, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";

const router = Router();

router.post("/login", loginValidation, validate, asyncHandler(login));
router.get("/me", authenticate, asyncHandler(me));

export default router;
