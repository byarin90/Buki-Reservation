import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"] as string;

  //take the payload from token
  const payload = jwt.decode(token) as { email: string };
  //if the payload.email is not exsit return error
  if (!payload.email) {
    return res.status(401).json({ error: "Unauthorized request" });
  }


  //return the user by email from the payload
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });
  //if user not found return error
  if (!user) {
    return res.status(401).json({
      errorMessage: "User not found",
    });
  }

  // return the user as JSON
  return res.json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    city: user.city,
    phone: user.phone
  });
}
