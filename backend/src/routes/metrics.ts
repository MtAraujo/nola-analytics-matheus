import { Router } from "express";
import { getTopProducts, getDeliveryPerformance, getRecurringCustomers, runPivotQuery, getMetricsCatalog, comparePeriods } from "../controllers/metrics.controller";

const router = Router();

router.get("/top-products", getTopProducts);
router.get("/delivery-performance", getDeliveryPerformance);
router.get("/recurring-customers", getRecurringCustomers);
router.post("/pivot/run", runPivotQuery);
router.get("/catalog", getMetricsCatalog);
router.post("/compare", comparePeriods);



export default router;
