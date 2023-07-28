import React, { useState, useEffect } from "react";

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
