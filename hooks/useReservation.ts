import { useState } from "react";
import axios from "axios";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerEmail,bookerFirstName,bookerLastName,bookerOccasion,bookerPhone,bookerRequest,setDidBook
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerFirstName:string,
    bookerLastName:string,
    bookerEmail:string,
    bookerPhone:string,
    bookerOccasion:string,
    bookerRequest:string,
    setDidBook: React.Dispatch<React.SetStateAction<boolean>>

  }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
            bookerFirstName,
            bookerLastName,
            bookerPhone,
            bookerEmail,
            bookerOccasion,
            bookerRequest,
          },
          {
            params: {
              day,
              time,
              partySize,
            },
        }
      );
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error,createReservation };
}
