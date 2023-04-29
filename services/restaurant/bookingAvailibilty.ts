interface SearchTimeWithTables {
    time: string;
    date: Date;
    tables: {
      id: number;
      seats: number;
    }[];
  }
  
  interface Restaurant {
    tables: {
      id: number;
      seats: number;
    }[];
    open_time: string;
    close_time: string;
    id: number;
  }
  
  interface Availability {
    time: string;
    available: boolean;
  }
  
  interface bookIsAvailibleProps {
    searchTimesWithTables: SearchTimeWithTables[];
    partySize: string;
    day: string;
    time: string;
    restaurant: Restaurant;
  }
  
  export const bookIsAvailible = ({
    searchTimesWithTables,
    partySize,
    day,
    time,
    restaurant,
  }: bookIsAvailibleProps): boolean => {
    const availabilities: Availability[] = searchTimesWithTables
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
  
    let booked = false;
    availabilities.forEach((t) => {
      if (t.time === time && t.available === false) {
        booked = true;
      }
    });
  
    return booked;
  };
  
  
  
  