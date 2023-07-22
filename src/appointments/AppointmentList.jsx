import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { Spinner, Table, TextInput } from "flowbite-react";
import { AppointmentService } from "../_helpers";
import dayjs from "dayjs";

export const AppointmentList = ({ refreshList }) => {
  // State
  const currentDate = new Date();
  const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const page = 1;
  const limit = 10;

  // Redux
  const authUser = useSelector((state) => state.auth?.user);
  const userId = authUser?.id;
  
  // Query appointments
  const queryClient = useQueryClient();
  
  // Fetch appointments
  const { data, isLoading, isError, error } = useQuery(
    ["appointmentByUserId", userId, selectedDate, page, limit],
    () =>
      AppointmentService.getAppointmentsByUserId(
        userId,
        selectedDate,
        page,
        limit
      )
        .then((response) => response.data)
        .catch((err) => console.log("err", err)),
    { cacheTime: 6000, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointmentByUserId", userId, selectedDate]);
    }
  }, [isError, error, queryClient, userId, selectedDate, refreshList]);

  // Appointments data
  const appointments = data?.appointments?.docs || [];

  const sortedAppointments = Array.isArray(appointments)
    ? [...appointments]
    : [];
  sortedAppointments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Event handlers
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between pb-4">
        <TextInput
          className=" p-1 pl-10 text-sm text-gray-900 w-80 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="date"
          min="2023-01"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Full Name</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Scheduling Date</Table.HeadCell>
          <Table.HeadCell>Sales Representative</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {sortedAppointments.map((appointment, index) => (
            <Table.Row
              key={appointment.id}
              className="bg-white text-xs dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>
                {dayjs(appointment.createdAt).format("DD/MM")}
              </Table.Cell>
              <Table.Cell
                className="whitespace-no-wrap front-medium text-gray-900 dark:text-white"
                style={{ whiteSpace: "nowrap" }}
              >
                {appointment.name.toUpperCase()}
              </Table.Cell>

              <Table.Cell
                className="px-3 py-3 sm:px-4 overflow-auto"
                style={{ whiteSpace: "nowrap", maxWidth: "120px" }}
              >
                {appointment.phone_1 && appointment.phone_2
                  ? `${appointment.phone_1} / ${appointment.phone_2}`
                  : appointment.phone_1 || appointment.phone_2}
              </Table.Cell>

              <Table.Cell
                className="px-3 py-3 sm:px-6  overflow-auto"
                style={{ whiteSpace: "nowrap", maxWidth: "120px" }}
              >
                {appointment.address.toLowerCase()}
              </Table.Cell>
              <Table.Cell>
                {dayjs(appointment.date).format("DD/MM/YY, HH:mm")}
              </Table.Cell>
              <Table.Cell>{appointment.commercial}</Table.Cell>
              <Table.Cell>
                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span
                    aria-hidden
                    className="absolute text-xs inset-0 bg-green-200 opacity-50 rounded-full"
                  ></span>
                  <span className="relative text-xs">{appointment.status}</span>
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {isLoading && (
        <div className="text-center">
          <Spinner aria-label="Default status example" size="xl" />
        </div>
      )}
    </div>
  );
};
