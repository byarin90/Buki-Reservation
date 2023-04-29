import { Item } from "@prisma/client";
import React from "react";

const MenuCard = ({
  item: { created_at, description, id, name, price, restaurant_id, updated_at },
}: {
  item: Item;
}) => {
  return (
    <div className=" border rounded p-3 w-[49%] mb-3">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="font-light mt-1 text-sm">
        {description}
      </p>
      <p className="mt-7">{!price.includes('$') && '$'}{price}</p>
    </div>
  );
};

export default MenuCard;
