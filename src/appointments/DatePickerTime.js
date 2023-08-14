// DatePickerTime.js
import React from "react";
import { Select } from "flowbite-react";

const DatePickerTime = ({ register }) => {
  // Heure de début (08:00 AM) et heure de fin (08:00 PM)
  const startTime = new Date("1970-01-01T08:00:00");
  const endTime = new Date("1970-01-01T20:00:00");

  // Générer les horaires avec un intervalle de 30 minutes
  const timeOptions = [];
  let currentTime = startTime;
  
  while (currentTime <= endTime) {
    const timeStr = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    timeOptions.push(
      <option key={timeStr} value={timeStr}>
        {timeStr}
      </option>
    );
    currentTime = new Date(currentTime.getTime() + 30 * 60000); // Ajouter 30 minutes en millisecondes
  }

  return (
    <Select {...register("time", { required: "Time is required" })}>
      <option value="">Select Time</option>
      {timeOptions}
    </Select>
  );
};

export default DatePickerTime;
