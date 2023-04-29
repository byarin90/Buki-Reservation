import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import React from "react";
const SearchSideBar = ({
  locations,
  cuisines,
  searchParams,
}: {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) => {
  const priceOptions = [
    {
      price: PRICE.CHEAP,
      label: "$",
      className: "border w-full text-reg text-center font-light rounded-l p-2",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
      className: "border w-full text-reg text-center font-light p-2",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      className: "border w-full text-reg text-center font-light rounded-r p-2 me-3",
    },
  ];


  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {locations?.map((location) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: location.name,
              },
            }}
            key={location.id}
            className="font-light text-reg block"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines?.map((cuisine) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: cuisine.name,
              },
            }}
            key={cuisine.id}
            className="font-light text-reg block"
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex ">
          {priceOptions.map(({price,label,className}, index) => (
            <Link
             
              key={index}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price,
                },
              }}
              className={className}
            >
             {label}
            </Link>
          ))}

          {/* <button className="border-r border-t border-b w-full text-reg font-light p-2">
            $$
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r">
            $$$
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SearchSideBar;
