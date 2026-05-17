import { Router } from "express";
import { listUsers, updateUserRole, userRoleValidation } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), asyncHandler(listUsers));
router.put("/:id/role", authenticate, authorize("admin"), userRoleValidation, validate, asyncHandler(updateUserRole));

export default router;
