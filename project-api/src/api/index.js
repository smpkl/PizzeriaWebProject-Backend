import express from "express";
import usersRouter from "./user/users-router.js";
import productsRouter from "./products/products-router.js";
import mealsRouter from "./meals/meals-router.js";
import tagsRouter from "./tags/tags-router.js";
import categoriesRouter from "./categories/categories-router.js";
import feedbacksRouter from "./feedbacks/feedbacks-router.js";
import announcementsRouter from "./announcement/announcements-router.js";
import ordersRouter from "./orders/orders-router.js";
import couponsRouter from "./coupons/coupons-router.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/meals", mealsRouter);
router.use("/tags", tagsRouter);
router.use("/categories", categoriesRouter);
router.use("/feedbacks", feedbacksRouter);
router.use("/announcements", announcementsRouter);
router.use("/orders", ordersRouter);
router.use("/coupons", couponsRouter);

export default router;
