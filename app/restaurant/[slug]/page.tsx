import React from "react";
import RestaurantNavbar from "./components/restaurantNavbar";
import Title from "./components/title";
import Rating from "./components/rating";
import Description from "./components/description";
import Images from "./components/images";
import Reviews from "./components/reviews";
import ResrvationCard from "./components/resrvationCard";
import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

// Restaurant interface definition
interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
  reviews: Review[];
  open_time: string;
  close_time: string;
}

// Function to fetch restaurant details based on its slug
const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      images: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};

// RestaurantDetails component definition
const RestaurantDetails = async ({ params: { slug } }: { params: { slug: string } }) => {
  const restaurant = await fetchRestaurantBySlug(slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ResrvationCard slug={restaurant.slug} openTime={restaurant.open_time} closeTime={restaurant.close_time} />
      </div>
    </>
  );
};

export default RestaurantDetails;
