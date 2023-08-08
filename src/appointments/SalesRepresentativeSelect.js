// SalesRepresentativeSelect.js
import React from "react";
import { Select } from "flowbite-react";

const SalesRepresentativeSelect = ({ register }) => {
  const salesRepresentatives = [
    "Annabelle Rodriguez",
    "Aurore Diallo",
    "Benoît Chamboissier",
    "Freddy Tamboers",
    "Julien Morel",
    "Simom Cadenne",
    "Théo Raymond",
  ];

  return (
    <Select
      id="commercial"
      {...register("commercial", {
        required: "Sales Representative is required",
      })}
    >
      <option value="">Select Sales Representative</option>
      {salesRepresentatives.map((representative, index) => (
        <option key={index} value={representative}>
          {representative}
        </option>
      ))}
    </Select>
  );
};

export default SalesRepresentativeSelect;
