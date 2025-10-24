import express from "express";
import { createUser, getUser } from "../controllers/userController.js";

const routerUser = express.Router();

routerUser.post("/", createUser);  
routerUser.get("/:userId", getUser); 

export default routerUser;
