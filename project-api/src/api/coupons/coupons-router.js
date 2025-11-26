import express from "express";
import { authenticateToken } from "../../middlewares/authentication.js";

import {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupons-controller.js";

const couponsRouter = express.Router();

// Routes related to announcements:
// Täytyykö gorAllCoupons laittaa authenticateToken? Voiko kuka tahansa hakea kaikki kupongit? Väärinkäyttömahdollisuus?
// Asiakkaan syöttämä kuponki pitää kuitenkin jotenkin tarkastaa, vaikka käyttäjä ei ole kirjautuneena.
couponsRouter.route("/").get(getAllCoupons).post(authenticateToken, addCoupon);
couponsRouter
  .route("/:id")
  .get(getCouponById) // Tämä myös?
  .put(authenticateToken, updateCoupon)
  .delete(authenticateToken, deleteCoupon);

export default couponsRouter;
