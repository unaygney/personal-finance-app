"use server";

import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { saveRefreshToken, saveUserInRedis } from "@/lib/data";
import db from "@/lib/db";
import { loginSchema, signUpSchema } from "@/lib/validations";
import bcrpyt from "bcrypt";
import { cookies } from "next/headers";
export const login = async (email: string, password: string) => {
  try {
    // check if the inputs are correct according to the schema
    const isValid = loginSchema.safeParse({ email, password });

    if (!isValid.success) {
      return { success: false, message: isValid.error.errors[0].message };
    }

    // Check if user exists
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }
    // check if the password is correct
    const isValidPassword = await bcrpyt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" };
    }

    // Generate access token and refresh token
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    // Save refresh token in redis
    await saveRefreshToken(user.id, refreshToken);

    // Create a session id
    const sessionId = `session_${user.id}_${Date.now()}`;

    // set user's info in redis
    await saveUserInRedis({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Set cookies
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });

    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true, message: "User logged in successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to login user.");
  }
};
export const register = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const isValid = signUpSchema.safeParse({ email, password, name });
    // Check if the inputs is valid according to the schema
    if (!isValid.success) {
      return { success: false, message: isValid.error.errors[0].message };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrpyt.hash(password, 10);

    // Register user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true, message: "User registered successfully" };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to register user.");
  }
};
