import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin (warehouse-manager)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    // Validate role
    const validRoles = [
      "warehouse-manager",
      "procurement-officer",
      "store-clerk",
    ];
    if (role && !validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "store-clerk",
    });

    if (user) {
      const userObj = user.toObject();
      delete (userObj as any).password;

      res.status(201).json(userObj);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { name, email, role, password } = req.body;

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }
    }

    // Validate role
    const validRoles = [
      "warehouse-manager",
      "procurement-officer",
      "store-clerk",
    ];
    if (role && !validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
        return;
      }
      user.password = password;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete (userObj as any).password;

    res.json(userObj);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400).json({ message: "You cannot delete your own account" });
      return;
    }

    await user.deleteOne();
    res.json({ message: "User removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
