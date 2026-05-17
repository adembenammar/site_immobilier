import { Router } from "express";
import { contactValidation, listMessages, submitContact, updateMessageStatus } from "../controllers/contactController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", contactValidation, validate, asyncHandler(submitContact));
router.get("/", authenticate, authorize("admin", "agent"), asyncHandler(listMessages));
router.patch("/:id/status", authenticate, authorize("admin", "agent"), asyncHandler(updateMessageStatus));

export default router;
