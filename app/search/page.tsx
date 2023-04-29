import React from "react";
import Header from "./components/header";
import RestaurantCard from "./components/restaurantCard";
import { Cuisine, Location, PRICE, PrismaClient, Review } from "@prisma/client";
import SearchSideBar from "./components/searchSideBar";
const prisma = new PrismaClient();

// Fetch all locations from the database
const fetchLocations = async () => {
  return prisma.location.findMany();
};

// Fetch all cuisines from the database
const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

// Restaurant interface definition
interface Restaurant {
  id: number;
  name: string;
  price: PRICE;
  location: Location;
  cuisine: Cuisine;
  main_image: string;
  slug: string;
  reviews: Review[];
}

// SearchParams interface definition
interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

// Function to fetch restaurants based on search parameters
const fetchRestaurantsByCity = async (searchParams: SearchParams): Promise<Restaurant[]> => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

// Search component definition
const Search = async ({
  searchParams,
}: {
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) => {
  const restaurants = await fetchRestaurantsByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar searchParams={searchParams} locations={locations} cuisines={cuisines} />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry, we found no restaurant in this area</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
