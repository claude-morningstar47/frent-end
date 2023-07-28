// // DailyOrdersTable.js
// import React from 'react';

// const DailyOrdersTable = () => {
//   // Contenu du tableau des commandes du jour (exemple)
//   const ordersData = [
//     { orderNumber: 'Freddy', product: '57', quantity: 5 },
//     { orderNumber: 'Aurore', product: '64', quantity: 10 },
//     { orderNumber: 'Annabelle', product: '90', quantity: 3 },
//     // Ajoutez plus de données de commandes ici
//   ];

//   return (
//     <div className="py-4 px-6 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Commandes du jour</h2>
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             <th className="px-4 py-2">Comercial</th>
//             <th className="px-4 py-2">Département</th>
//             <th className="px-4 py-2">Quantité</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ordersData.map((order) => (
//             <tr key={order.orderNumber}>
//               <td className="border px-4 py-2">{order.orderNumber}</td>
//               <td className="border px-4 py-2">{order.product}</td>
//               <td className="border px-4 py-2">{order.quantity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DailyOrdersTable;

import React from 'react';

const DailyOrdersTable = ({ data, week }) => {
  const { employees = [] } = data ?? {};

  const calculateTotalRdv = (appointments) => {
    return appointments.reduce((total, { rdv }) => total + rdv, 0);
  };

  return (
    <div className="bg-gray-100 p-9">

      {/* Vos en-têtes pour le chargement, les erreurs et les performances */}
      <h2 className="text-xl font-bold mb-4">Commande de la journée</h2>

      <table className="w-full border border-gray-900 text-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 font-bold">Commercial</th>
            <th className="px-4 py-2 font-bold">Département</th>
            <th className="px-4 py-2 font-bold">Nombre de RDV</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td className="border border-gray-900 px-4 py-2 bg-gray-200">
                <p className="text-lg font-bold">{employee.name}</p>
              </td>
              <td className="border border-gray-900 px-4 py-2">
                <p>{employee.department}</p>
              </td>
              <td className="border border-gray-900 px-4 py-2">
                <p className="font-bold">{employee.rdv}</p>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {employees.length > 0 && (
            <tr>
              <td className="border border-gray-900 px-4 py-2 font-bold text-2xl text-start">
                Total
              </td>
              <td className="border border-gray-900 px-4 py-2"></td>
              <td className="border border-gray-900 px-4 py-2 font-bold text-2xl">
                {calculateTotalRdv(employees)}
              </td>
            </tr>
          )}
        </tfoot>
      </table>

      {/* Your Fetching... */}
    </div>
  );
};

export default DailyOrdersTable;

