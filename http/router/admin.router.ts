import { Router } from "express";
import { isAuthenticated } from "../controllers/user.controller";
import { addAvatar } from "../controllers/admin.controller";

const router = Router()

router.route("/avatar").post(isAuthenticated, addAvatar)

export default router
