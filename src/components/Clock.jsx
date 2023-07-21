import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Mettre à jour toutes les 1000 ms (1 seconde)

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p className="text-xl font-bold">{time.toLocaleTimeString()}</p>
    </>
  );
};

export default Clock;
