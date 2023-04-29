import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { findAvailabileTables } from "../../../../services/restaurant/findAvailableTables";
const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };
    // Check if required query parameters are provided
    if (!day || !time || !partySize) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }
  
      // Retrieve restaurant information with tables
      const restaurant = await prisma.restaurant.findUnique({
        where: {
          slug,
        },
        select: {
          tables: true,
          open_time: true,
          close_time: true,
        },
      });
    
      // Check if the restaurant data is valid
      if (!restaurant) {
        return res.status(400).json({
          errorMessage: "Invalid data provided",
        });
      }
  
    // Map searchTimesWithTables to create an 'availabilities' array containing the available time slots and their corresponding seat capacity
    const searchTimesWithTables = await findAvailabileTables({
      day,
      time,res,restaurant
    })
    if(!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }
    const availabilities = searchTimesWithTables
    .map((t) => {
        // Calculate the total number of seats for the available tables at the given time slot
        const sumSeats = t.tables.reduce((sum, table) => {
          return sum + table.seats;
        }, 0);
  
        // Return an object containing the time slot and a boolean indicating whether the total number of seats is greater than or equal to the requested party size
        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
  // Filter the 'availabilities' array to only include time slots that are within the restaurant's opening and closing hours
  .filter((availability) => {
      // Check if the availability time is equal to or after the restaurant's opening hour
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      
      // Check if the availability time is equal to or before the restaurant's closing hour
      const timeIsBeforeClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);
    
      // Return true if both conditions are met (i.e., the time slot is within the restaurant's opening and closing hours)
      // If either condition is not met, the time slot will be excluded from the filtered array
      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });
      // Send a response with a status code of 200 (OK) and a JSON object containing the 'availabilities' array
    return res.status(200).json(
      availabilities,
    );
  
  }
};

export default handler;


