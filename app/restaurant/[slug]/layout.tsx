import React from "react";
import Header from "./components/header";

const RestaurantLayout = ({
    children,params:{slug}
  }: {
    children: React.ReactNode;
    params:{slug:string}
  }) => {
  return (
    <main>
      <Header name={slug}/>
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </main>
  );
};

export default RestaurantLayout;
