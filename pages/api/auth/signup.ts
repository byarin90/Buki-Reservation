// Import necessary modules and types
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the default export as an async function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Extract fields from the request body
    const { firstName, lastName, email, phone, city, password } = req.body;

    // Initialize an array for error messages
    const errors: string[] = [];

    // Define a validation schema to check the validity of input fields
    const validationSchema = [
      // Validate firstName
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      // Validate lastName
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      // Validate email
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      // Validate phone
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone number is invalid",
      },
      // Validate city
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: "City is invalid",
      },
      // Validate password strength
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
      },
    ];

    // Check validation schema for errors
    validationSchema.forEach((check) => {
      if (!check.valid) {
        // Add error message to errors array
        errors.push(check.errorMessage);
      }
    });

    // If there are errors, return the first one with a status of 400
    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    // Check if a user with the same email already exists
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If a user with the same email exists, return an error message
    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email,
      },
    });

    // Set the algorithm for JWT signing as HS256 (HMAC with SHA-256)
    const alg = "HS256";

    // Encode the JWT secret using the TextEncoder
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // Create a JWT token with the user's email as the payload
    const token = await new jose.SignJWT({ email: user.email })
      // Set the protected header with the specified algorithm (HS256)
      .setProtectedHeader({ alg })
      // Set the expiration time for the token to 24 hours
      .setExpirationTime("24h")
      // Sign the token using the encoded secret
      .sign(secret);

    // Set the JWT token as a cookie in the user's browser
    // with a max age of 60 minutes * 6 hours * 24 = 8640 minutes (6 days)
    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });

    // Return user information as JSON with a status of 200
    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(404).json("Unknown endpoint");
}
