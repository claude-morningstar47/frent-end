import React from "react";
import { AppointmentWeek } from "../appointments/AppointmentWeek";
import { FullScreen } from "../_helpers/Fullscreen";
// import SwitchPage from "../appointments/SwitchPage";
import Clock from "../_helpers/Clock";
// import DailyOrdersTable from "../appointments/DailyOrdersTables";

export default function ManagerPage() {
  return (
    <>
      <div className="flex flex-col item-center">
        <p className="text-x1 font-semibold leading-tight mb-4">
          Welcome Manager  <Clock />
        </p>
      </div>
      <div className="w-full flex justify-center">
     
      <FullScreen >
      <AppointmentWeek />
      {/* <DailyOrdersTable/> */}
      {/* <SwitchPage/> */}
      </FullScreen>
      </div>
    </>
  );
}
