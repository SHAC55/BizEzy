import { Router } from "express";
<<<<<<< HEAD
import { getUserHandler } from "../controllers/user.controller";
=======
import { getUserHandler, updateUserHandler } from "../controllers/user.controller";
>>>>>>> dev

const userRoutes = Router();

userRoutes.get("/", getUserHandler);
<<<<<<< HEAD
=======
userRoutes.patch("/", updateUserHandler);
>>>>>>> dev

export default userRoutes;
