import { Router } from "express";
import { createDashboard, getDashboards, getDashboardById, deleteDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.post("/", createDashboard);
router.get("/", getDashboards);
router.get("/:id", getDashboardById);
router.delete("/:id", deleteDashboard);

export default router;
