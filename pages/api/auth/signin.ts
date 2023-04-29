// Import required libraries and modules
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

// Initialize PrismaClient
const prisma = new PrismaClient();

// Main handler function for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Initialize an array to store errors
    const errors: string[] = [];
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      errors.push("Email is required");
    }

    if (!password) {
      errors.push("Password is required");
    }

    // Return an error if any input is missing
    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    // Validate email and password using the validator library
    const validationSchema = [
      { valid: validator.isEmail(email), errorMessage: "Email is invalid" },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: "Password is invalid",
      },
    ];

    // Add any validation errors to the errors array
    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    // Return the first error if any validation failed
    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    // Find a user by their email address
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select:{
        first_name:true,
        last_name:true,
        email:true,
        phone:true,
        city:true,
        password:true
      }
    });

    // Return an error if no user was found with the provided email
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Return an error if the password doesn't match
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

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

    // Return the user data as a JSON response
    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  // Return a 404 error for any non-POST requests
  return res.status(404).json("Unknown endpoint");
}
