import { Cuisine, Location, PRICE, Review } from "@prisma/client";
import Link from "next/link";
import React from "react";
import Price from "../../components/price";
import {calculateReviewRatingAverage} from "../../../utils/calculateReviewAverage";
import Stars from "../../components/stars";
 export interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  price: PRICE;
  location: Location;
  cuisine: Cuisine;
  slug: string;
  reviews:Review[]
}

const RestaurantCard = ({ restaurant:{id,cuisine,location,main_image,name,price,slug,reviews} }: { restaurant: Restaurant }) => {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(reviews);

    if (rating > 4) return "Awesome";
    else if (rating <= 4 && rating > 3) return "Good";
    else if (rating <= 3 && rating > 0) return "Average";
    else "";
  };
  return ( 
    <div className="border-b flex pb-5">
      <img
        src={main_image}
        alt=""
        className="w-44 h-36 rounded"
      />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
         <Stars reviews={reviews}/>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price}/>
            <p className="mr-4">{cuisine.name}</p>
            <p className="mr-4">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
