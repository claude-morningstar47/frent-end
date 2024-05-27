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
    "Helene Jehamo",
    "Julien Hendrickx",
    "Julien Camilleri",
    "Julien Morel",
    "Loris Miran",
    "Karine Nobile",
    "Malcom Pichaud",
    "Mathieu Renault",
    "Manuel Romero",
    "Murphy Verger",
    "Simon Cadenne",
    "Simon Ley",
    "Sylvie Delon",
    "Sophie Portal",
    "Sophie Rousmans",
    "Théo Raymond",
    "Vincen Le Mauff",
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
