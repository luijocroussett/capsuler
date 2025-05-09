const express = require("express");
const router = express.Router();
const {getAllUsersController, getUserController, createUserController, updateUserController} = require("../controllers/usersController");
const validateUsersPostReq = require("../middleware/validateUsersPostReq");
const encryptPassword = require("../middleware/encryptPassword");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/",authenticateUser, getAllUsersController);

router.get("/:id", authenticateUser, getUserController);

router.post("/", validateUsersPostReq, encryptPassword, createUserController);

router.put("/", authenticateUser, updateUserController);

module.exports = router;
