import { Router } from "express";
import {
  changePasswordHandler,
  deleteAccountHandler,
  getUserHandler,
  updateUserHandler,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", getUserHandler);
userRoutes.patch("/", updateUserHandler);
userRoutes.post("/password", changePasswordHandler);
userRoutes.post("/delete", deleteAccountHandler);

export default userRoutes;
