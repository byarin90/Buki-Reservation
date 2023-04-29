import { PrismaClient, Table } from "@prisma/client";
import { NextApiResponse } from "next";
import { times } from "../../data";

const prisma = new PrismaClient();

export const findAvailabileTables = async ({
  time,
  day,
  res,
  restaurant
}: {
  time: string;
  day: string;
  res: NextApiResponse;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
} 
}) => {
  // Find the matching time slot
  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  // Check if the time slot is valid
  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: "Invalid time provided",
    });
  }

  // Retrieve bookings within the specified time range
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  // Initialize an empty object to map booking times to table IDs
  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  // Loop through each booking
  bookings.forEach((booking) => {
    // For each booking, map its booking time (as an ISO string) to an object containing table IDs
    bookingTablesObj[booking.booking_time.toISOString()] =
      // Reduce the tables array for the current booking into a single object
      booking.tables.reduce((obj, table) => {
        // Spread the existing obj and add a new property with the table ID as the key and 'true' as the value
        return {
          ...obj,
          [table.table_id]: true,
        };
      }, {}); // Initialize the accumulator with an empty object
  });



  // Get tables of the restaurant
  const tables = restaurant.tables;

  // Map search times with their corresponding tables
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  // Loop through each search time with its corresponding tables
  searchTimesWithTables.forEach((t) => {
    // For each search time, filter the tables based on their availability
    t.tables = t.tables.filter((table) => {
      // Check if there are any bookings for the current search time
      if (bookingTablesObj[t.date.toISOString()]) {
        // Check if the current table is already booked for the current search time
        if (bookingTablesObj[t.date.toISOString()][table.id]) {
          // If the table is already booked, exclude it from the filtered tables
          return false;
        }
      }
      // If there is no booking for the current table, include it in the filtered tables
      return true;
    });
  });
  
  return searchTimesWithTables;
};
