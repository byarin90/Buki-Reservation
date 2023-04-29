"use client";
import React, { useState } from "react";
import { partySize as partySizes, times } from "../../../../data/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { Time, convertToDisplayTime } from "../../../../utils/convertToDisplayTime";

const ResrvationCard = ({
  closeTime,
  openTime,
  slug
}: {
  closeTime: string;
  openTime: string;
  slug: string;
}) => {
  const {data,error,fetchAvailabilities,loading} = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time,setTime] = useState(openTime);
  const [partySize,setPartySize] = useState('2');
  const [day,setDay] = useState(new Date().toISOString().split("T")[0]);
  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0])
      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };
  const handlerClick = () =>{
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize
    });
  }
  const filterTimesByRestaurantOpenWindow = () => {
    //? openTime = 14:30:00.000Z 2:30PM
    //? closeTime = 21:30:00.000Z 9:30PM
    const timesWithinWindow:typeof times = [];
    let isWithinWindow = false;
    times.forEach(time => {
      if(!isWithinWindow && time.time === openTime) {
        isWithinWindow = true;
      }

      if(isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if(time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };
  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light" id="" onChange={(e)=>setPartySize(e.target.value)} value={partySize}>
          {partySizes.map((size,i) => (
            <option key={i} value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            className="py-3 text-center borber-b font-light text-reg w-24"
            selected={selectedDate}
            onChange={handleChangeDate}
            dateFormat={"MMMM d"}
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light" onChange={(e)=>setTime(e.target.value)} value={time}>
            {filterTimesByRestaurantOpenWindow().map((time,i) => (
              <option key={i} value={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button disabled={loading} className="bg-red-600 hover:bg-red-700 hover:duration-300 rounded w-full px-4 text-white font-bold h-16" onClick={handlerClick}>
          {loading ? <CircularProgress color="inherit"/> : 'Find a Time'}
        </button>
      </div>
      {data && data.length ? (
      <div>
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time,i) =>time.available ? (
              <Link key={i}
               href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
               className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
               >
                <p className="text-sm font-bold">{convertToDisplayTime(time.time as Time)}</p>
               </Link>
            ):<p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>)}
          </div>
        </div>
      </div>
      )
      :null}
    </div>
  );
};

export default ResrvationCard;
