"use client";
import React, { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = Date.parse(targetDate);
      const currentTime = Date.now();
      const timeDifference = targetTime - currentTime;

      if (isNaN(targetTime) || timeDifference <= 0) {
        setIsExpired(true);
        return;
      }

      setDays(Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((timeDifference / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((timeDifference / 1000 / 60) % 60));
      setSeconds(Math.floor((timeDifference / 1000) % 60));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="py-4 px-6 bg-white rounded-lg shadow-2 inline-block">
        <span className="font-bold text-red text-xl lg:text-2xl">Offer Closed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 mt-6">
      {/* Days */}
      <div>
        <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
          {days < 10 ? "0" + days : days}
        </span>
        <span className="block text-custom-sm text-dark text-center">Days</span>
      </div>

      {/* Hours */}
      <div>
        <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
          {hours < 10 ? "0" + hours : hours}
        </span>
        <span className="block text-custom-sm text-dark text-center">Hours</span>
      </div>

      {/* Minutes */}
      <div>
        <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
          {minutes < 10 ? "0" + minutes : minutes}
        </span>
        <span className="block text-custom-sm text-dark text-center">Minutes</span>
      </div>

      {/* Seconds */}
      <div>
        <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
          {seconds < 10 ? "0" + seconds : seconds}
        </span>
        <span className="block text-custom-sm text-dark text-center">Seconds</span>
      </div>
    </div>
  );
}