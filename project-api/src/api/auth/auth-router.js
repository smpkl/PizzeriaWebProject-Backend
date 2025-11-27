import express from "express";
import { postAdminLogin, postUserLogin } from "./auth-controller.js";

const authRouter = express.Router();

// Laitoin nämä erikseen sillä ajatuksella, että toisella kirjaudutaan sinne admin sivustolle (tarkistaa käyttäjän roolin) ja toisella perussivustolle. -Riikka
authRouter.route("/admin/login").post(postAdminLogin);
authRouter.route("/user/login").post(postUserLogin);

export default authRouter;
