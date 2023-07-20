import React from "react";
import { Link } from "react-router-dom";
// import { AppointmentWeek } from "../appointments/AppointmentWeek";
import { AppointmentAllList } from "../appointments/AppointmentAllList";

export default function AdminPage() {

  return (
    <>
      <div className="flex flex-col item-center">
        <p className="text-x1 font-semibold leading-tight mb-4 flex justify-center">
          Welcome Admin
        </p>
        <Link to='../users'>Manage users ==== </Link>
        {/* <AppointmentWeek/> */}
        <div className="mt-3">

        <AppointmentAllList/>
        </div>
      </div>

      
    </>
  );
}