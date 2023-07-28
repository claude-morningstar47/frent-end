// SwitchPage.js
import React, { useState, useEffect } from "react";
import { AppointmentWeek } from "../appointments/AppointmentWeek";
import DailyOrdersTable from "../appointments/DailyOrdersTables";

const SwitchPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [<AppointmentWeek />, <DailyOrdersTable />];
  const delayBetweenPages = 60000; // Délai de 1 munites entre les pages (60000 millisecondes)

  useEffect(() => {
    // Fonction pour basculer vers la page suivante
    const switchToNextPage = () => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    };

    // Définir un minuteur pour basculer vers la page suivante après le délai spécifié
    const timer = setTimeout(switchToNextPage, delayBetweenPages);

    // Nettoyer le minuteur lorsque le composant est démonté ou que la page est modifiée
    return () => clearTimeout(timer);
  }, [currentPage, pages.length]);

  return (
    <div>
      {/* Afficher la page actuelle */}
      {pages[currentPage]}
    </div>
  );
};

export default SwitchPage;
