
const { getAllUsers, getUser, createUser, updateUser} = require("../models/userModels");
const { v4: uuidv4 } = require("uuid");



const getAllUsersController = async (req, res) => {
    try {
      console.log(`- ${new Date().toISOString()} - GET request received at /users | Fetching all users`);
      const result = await getAllUsers(res.locals.pgPool);
      console.log("Users fetched successfully: 200 OK");
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  const getUserController = async (req, res) => {
    const { id: userId } = req.params;
    try {
      console.log(`- ${new Date().toISOString()} - GET request received at /users for user ID: ${userId} | Fetching all users`);
      const result = await getUser({ id: userId }, res.locals.pgPool);
      console.log("result", result);
      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User fetched successfully: 200 OK");
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  const createUserController =  async (req, res) => {
    const {
      id = uuidv4(),
      name,
      email,
      password,
      date_of_birth = null,
    } = req.body;

    try {
      console.log(`- ${new Date().toISOString()} - 
              POST request received at /users
              Creating user with id: ${id}, name: ${name}, email: ${email}, password: ${password}, date_of_birth: ${date_of_birth}`);
      const result = await createUser({
        id,
        name,
        email,
        password,
        date_of_birth,
      }, res.locals.pgPool);
      console.log("User created successfully: 201 Created");
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  const updateUserController = async (req, res) => {
    const { name, email, password, date_of_birth, id } = req.body;
    console.log(`- ${new Date().toISOString()} - PUT request received at /users/ | Updating user with id: ${id}, name: ${name}, email: ${email}, password: ${password}, date_of_birth: ${date_of_birth}`);
    try {
      const result = await updateUser({
        id: id,
        name: name || null,
        email: email || null,
        password: password || null,
        date_of_birth: date_of_birth || null,
      }, res.locals.pgPool);
      console.log("User updated successfully: 200 OK");
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

module.exports = {
    getAllUsersController,
    getUserController,
    createUserController,
    updateUserController
};