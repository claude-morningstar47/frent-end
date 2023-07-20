import { useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import { AppointmentService } from "../_helpers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export const AppointmentWeek = () => {
  const currentDate = dayjs().format("YYYY");
  const currentWeek = dayjs().isoWeek();
  const dateWeek = `${currentDate}-W${currentWeek}`;

  const [week, setWeek] = useState(dateWeek);

  // Fetch appointments
  const retrieveAppointments = async (week) => {
    try {
      const response = await AppointmentService.getAllAppointmentsByWeek(week);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const queryClient = useQueryClient();

  const { data, error, isLoading, isError, isFetching } = useQuery(
    ["appointments", week],
    () => retrieveAppointments(week),
    // { cacheTime: 60000 }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointments", week]);
    }
  }, [isError, error, queryClient, week]);

  const { employees } = data || [];

  const filteredEmployees =
    employees?.map((employee) => ({
      ...employee,
      week: employee.week?.slice(1, 6)
    }));

  // Afficher le résultat
  const calculateTotal = (sales) => {
    return sales.reduce((total, sale) => total + sale, 0);
  };

  const handleWeek = (e) => {
    setWeek(e.target.value);
  };

  return (
    <div className="bg-gray-100 p-4">
      <input type="week" name="week" id="week" value={week} onChange={handleWeek}/>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Performance des employés de la semaine
          </h2>

          <table className="w-full border border-gray-900" style={{ zIndex: "9999" }}>
            <thead>
              <tr>
                <th className="px-4 py-2 font-bold">Agent</th>
                {/* <th className="px-4 py-2 bg-blue-200 font-bold">Dimanche</th> */}
                <th className="px-4 py-2 bg-blue-200 font-bold">Lundi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Mardi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Mercredi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Jeudi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Vendredi</th>
                {/* <th className="px-4 py-2 bg-blue-200 font-bold">Samedi</th> */}
                <th className="px-4 py-2 bg-blue-200 font-bold">
                  Total semaine
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees?.map((employee, index) => (
                <tr key={index}>
                  <td className="border  border-gray-900 px-6 py-2 bg-gray-200">
                    <p className="text-lg font-bold">{employee.name} </p>
                  </td>
                  {employee?.week?.map((sale, dayIndex) => (
                    <td key={dayIndex} className={`border border-gray-900 px-4 py-2 ${ sale > 2 ? "bg-green-200" : "bg-yellow-200"}`}>
                      {/* <p className="font-bold  text-2xl text-center">{sale} </p>  */}
                      <p className={`font-bold text-2xl text-center ${ sale === 0 ? "text-red-500" : ""}`}>
                        {sale}
                      </p>
                    </td>
                  ))}
                  <td className="border px-4 border-gray-900 py-2 font-bold">
                    <p className="font-bold  text-2xl text-center ">
                      {calculateTotal(employee?.week)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {filteredEmployees?.length > 0 && (
                <tr>
                  <td className="border border-gray-900 px-4 py-2 font-bold text-2xl text-start">
                    Total
                  </td>

                  {filteredEmployees[0].week?.map((_, dayIndex) => (
                    <td key={dayIndex} className={`border border-gray-900 px-4 py-2 font-bold ${
                        employees.reduce( (total, employee) => total + employee.week[dayIndex], 0 ) > 14 ? "bg-green-200" : "bg-yellow-200" }`}>
                      <p className="font-bold text-2xl font-bold text-center">                       
                        {filteredEmployees?.reduce((total, employee) => total + employee.week[dayIndex], 0 )}
                      </p>
                    </td>
                  ))}
                  <td className="border border-gray-900 px-4 py-2 ">
                    <p className="font-bold text-2xl text-red-500 font-bold text-center">
                      {calculateTotal( employees?.reduce((sales, employee) => sales.concat(employee.week), []))}
                    </p>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      )}
      {isFetching ? <span>Fetching...</span> : null}
    </div>
  );
};
