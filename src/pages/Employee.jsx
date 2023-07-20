import React from "react";

const EmployeePerformanceTable = () => {
  

  // Données factices pour l'exemple
  const employees = [
    { name: "Landry Tie", sales:    [4, 5, 3, 1, 0] },
    { name: "Ali Ouattara", sales:  [1, 2, 1, 0, 0] },
    { name: "Etienne Dago", sales:  [3, 1, 5, 1, 0] },
    { name: "Georges Tembo", sales: [1, 1, 1, 1, 0] },
    { name: "Balo Djegna", sales:   [1, 1, 1, 0, 0] },
    { name: "Lopez Yao", sales:     [2, 2, 3, 2, 0] },
    { name: "Chantal Gbaly", sales: [1, 1, 0, 0, 0] },
  ];

  const calculateTotal = (sales) => {
    return sales.reduce((total, sale) => total + sale, 0);
  };

  return (
    <div className="p-4">
      
      <h2 className="text-xl font-bold mb-4">
        Performance des employés de la semaine
      </h2>

      <table className="w-full border border-gray-900" style={{ zIndex: "9999" }}>
        <thead>
          <tr>
            <th className="px-4 py-2 font-bold">Agent</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Lundi</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Mardi</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Mercredi</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Jeudi</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Vendredi</th>
            <th className="px-4 py-2 bg-blue-200 font-bold">Total semaine</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td className="border  border-gray-900 px-6 py-2 bg-gray-200">
                <p className="text-lg font-bold">{employee.name} </p>
              </td>
              {employee.sales.map((sale, dayIndex) => (
                <td key={dayIndex} className={`border border-gray-900 px-4 py-2 ${ sale > 2 ? "bg-green-200" : "bg-yellow-200"}`}>
                  <p className={`font-bold text-2xl text-center ${ sale === 0 ? "text-red-500" : "" }`}>
                    {sale}
                  </p>
                </td>
              ))}
              <td className="border px-4 border-gray-900 py-2 font-bold">
                <p className="font-bold  text-2xl text-center ">
                  {calculateTotal(employee.sales)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border border-gray-900 px-4 py-2 text-red-500 font-bold text-2xl text-start">
              Total
            </td>
            {employees[0].sales.map((_, dayIndex) => (
              <td key={dayIndex} className={`border border-gray-900 px-4 py-2 font-bold ${employees.reduce(
                    (total, employee) => total + employee.sales[dayIndex], 0) > 14 ? "bg-green-200" : "bg-yellow-200"}`}>
                <p className="font-bold text-2xl text-red-500 font-bold text-center">                 
                  {employees.reduce((total, employee) => total + employee.sales[dayIndex], 0 )}
                </p>
              </td>
            ))}
            <td className="border border-gray-900 px-4 py-2 ">
              <p className="font-bold text-2xl text-red-500 font-bold text-center">
                {calculateTotal(employees.reduce( (sales, employee) => sales.concat(employee.sales), [] ))}
              </p>
            </td>
          </tr>
        </tfoot>
      </table>

    </div>
  );
};

export default EmployeePerformanceTable;
