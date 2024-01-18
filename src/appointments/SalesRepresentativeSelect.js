// SalesRepresentativeSelect.js
import React from "react";
import { Select } from "flowbite-react";

const SalesRepresentativeSelect = ({ register }) => {
  const salesRepresentatives = [
    "Annabelle Rodriguez",
    "Aurore Diallo",
    "Benoît Chamboissier",
    "Fatima Jabri",
    "Freddy Tamboers",
    "Julien Camilleri",
    "Julien Morel",
    "Mathieu Renault",
    "Simon Cadenne",
    "Sophie Rousmans",
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
