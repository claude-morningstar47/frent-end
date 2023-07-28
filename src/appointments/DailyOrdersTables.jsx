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

