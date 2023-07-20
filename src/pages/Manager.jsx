import React from "react";
import { AppointmentWeek } from "../appointments/AppointmentWeek";
import { FullScreen } from "../components/Fullscreen";

export default function ManagerPage() {
  return (
    <>
      <div className="flex flex-col item-center">
        <p className="text-x1 font-semibold leading-tight mb-4">
          Welcome Manager
        </p>
      </div>
      <div className="w-full flex justify-center"></div>
      <FullScreen />
      <AppointmentWeek />
    </>
  );
}
