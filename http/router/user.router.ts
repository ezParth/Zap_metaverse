import { Router } from "express";
import { login, signup } from "../controllers/user.controller";

const router = Router()

router.route("/login").post(login)
router.route("/signin").post(signup)

export default router
