import Header from "./components/header";
import RestaurantCard from "./components/restaurantCard";
import { Cuisine, Location, PRICE, PrismaClient, Review } from "@prisma/client";
 
export interface RestaurantCardType {
  id:number;
  name:string;
  main_image:string;
  slug:string
  cuisine:Cuisine;
  location:Location;
  price:PRICE;
  reviews:Review[],
}

const prisma = new PrismaClient();

const fetchRestaurants = async ():Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select:{
      id:true,
      name:true,
      location:true,
      price:true,
      main_image:true,
      cuisine:true,
      slug:true,
      reviews:true
    }
  });
  return restaurants;
}
export default async function Home() {
  const restaurants = await fetchRestaurants();
  return (
    <main>
      <Header />
      <div className="py-3 md:px-32 lg:px-40 xl:px-32 mt-10 flex flex-wrap justify-center"> {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
 
      </div>
    </main>
  );
}
