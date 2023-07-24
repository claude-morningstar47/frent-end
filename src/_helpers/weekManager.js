import { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

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
