import { useQuery } from "react-query";
import { instance } from "../_helpers";
import { useState, useEffect, useCallback } from "react";

const useFetchAppointments = () => {
  const fetchAppointments = useCallback((page, limit, startDate, endDate) => {
    return instance
      .get(
        `/appointments/?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
      )
      .then((response) => response.data);
  }, []);

  return fetchAppointments;
};

export const AppointmentAllList = () => {
  const [page, setPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAppointments = useFetchAppointments();

  useEffect(() => {
    // Vérifiez si les valeurs ont changé avant de déclencher l'appel à l'API
    if (page && limit && startDate && endDate) {
      fetchAppointments(page, limit, startDate, endDate);
    }
  }, [page, limit, startDate, endDate, fetchAppointments]);

  const { data, error, isLoading, isError, isFetching, isPreviousData } =
    useQuery(
      ["appointments", page, limit, startDate, endDate],
      () => fetchAppointments(page, limit, startDate, endDate),{
        cacheTime: 60000
      }
    );

    const { appointments, totalPages, hasNextPage, hasPrevPage } = data || [];
//   const appointments = data?.appointments;
    console.log(appointments.docs);
  //   console.log(appointments.docs);

  return (
    <div className="bg-gray-100">
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {appointments?.docs?.map((item) => (
            <p key={item._id}>{item.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page}</span>

      <button
        className="bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => setPage((old) => Math.max(old - 1, 1))}
        disabled={!hasPrevPage}
      >
        Previous Page
      </button>
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded"
        onClick={() => {
          if (!isPreviousData && hasNextPage) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPreviousData || !hasNextPage}
      >
        Next Page
      </button>

      {isFetching ? <span>Loading...</span> : null}
    </div>
  );
};
