// DatePickerDate.js
import React from "react";
import { TextInput } from "flowbite-react";

const DatePickerDate = ({ register }) => {
  return (
    <TextInput
      type="date"
      {...register("date", { required: "Date is required" })}
    />
  );
};

export default DatePickerDate;
