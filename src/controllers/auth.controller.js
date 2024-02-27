import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    const userSaved = await newUser.save();
    const access_token = await createAccessToken({ id: userSaved._id });
    res.cookie("access_token", access_token, {
      sameSite: "none", // agregado por mi
      secure: true, // agregado por mi
      // httpOnly: false,
    });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
    const access_token = await createAccessToken({ id: userFound._id });
    res.cookie("access_token", access_token, {
      sameSite: "none", // agregado por mi
      secure: true, // agregado por mi
      // httpOnly: false,
    });
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("access_token", "", {
    expires: new Date(0),
    sameSite: "none", // agregado por mi
    secure: true, // agregado por mi
    // httpOnly: false,
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  const { access_token } = req.cookies;
  if (!access_token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(access_token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
