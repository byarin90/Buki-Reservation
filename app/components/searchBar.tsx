"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const SearchBar = () => {
    const router = useRouter();
    const [location,setLocation] = useState("");

  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
    <input
      className="rounded  mr-3 p-2 md:w-[450px]"
      type="text"
      placeholder="State, city or town"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
    <button onClick={()=>{
     
        router.push("/search?city="+location)
      
    }} className="rounded bg-red-600 px-9 py-2 text-white hover:bg-red-700 hover:duration-300">
      Let's go
    </button>
  </div>  )
}

export default SearchBar