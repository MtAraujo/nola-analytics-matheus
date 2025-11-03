import { Router } from "express";
import { shareDashboard, getSharedDashboard } from "../controllers/share.controller";

const router = Router();

router.post("/", shareDashboard);
router.get("/:token", getSharedDashboard);

export default router;
