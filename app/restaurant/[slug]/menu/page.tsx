import React from "react";
import RestaurantNavbar from "../components/restaurantNavbar";
import Menu from "../components/menu";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const fetchRestaurantMenu = async (slug:string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where:{
      slug:slug
    },select:{
      items:true
    }
  })
  if(!restaurant){
    throw new Error("Restaurant not found")
  }
  return restaurant.items;
}
const RestaurantMenu =async ({params:{slug}}:{params:{slug:string}}) => {
  const menu = await fetchRestaurantMenu(slug);
  
  return (

        <div className="bg-white w-[100%] rounded p-3 shadow">
          <RestaurantNavbar slug={slug}/>
          <Menu menu={menu}/>
        </div>

  );
};

export default RestaurantMenu;
