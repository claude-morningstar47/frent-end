import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

// fomated selected date
export const formatSelectedDate = (date) => {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
};

// Clock
export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Mettre à jour toutes les 1000 ms (1 seconde)

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="items-center">
      <p className="text-xl font-bold">Heure : {time.toLocaleTimeString()}</p>
    </div>
  );
};

// Week Manager
const initialWeek = () => {
  const currentDate = dayjs().format("YYYY");
  const currentWeek = dayjs().isoWeek();
  return `${currentDate}-W${currentWeek}`;
};

export const useWeekManager = () => {
  const [week, setWeek] = useState(initialWeek());

  const handleWeekChange = (newWeek) => {
    setWeek(newWeek);
  };

  return { week, handleWeekChange };
};
