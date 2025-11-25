import express from "express";
//import adminRouter from "./routes/admin-router.js";
import productsRouter from "./routes/products-router.js";
import mealsRouter from "./routes/meals-router.js";
import tagsRouter from "./routes/tags-router.js";
import categoriesRouter from "./routes/categories-router.js";
import feedbacksRouter from "./routes/feedbacks-router.js";
import announcementsRouter from "./routes/announcements-router.js";
import ordersRouter from "./routes/orders-router.js";
import couponsRouter from "./routes/coupons-router.js";

const router = express.Router();

//router.use("/admin", adminRouter);
router.use("/products", productsRouter);
router.use("/meals", mealsRouter);
router.use("/tags", tagsRouter);
router.use("/categories", categoriesRouter);
router.use("/feedbacks", feedbacksRouter);
router.use("/announcements", announcementsRouter);
router.use("/orders", ordersRouter);
router.use("/coupons", couponsRouter);

export default router;
