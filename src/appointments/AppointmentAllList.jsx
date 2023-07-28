import React, { useEffect, useRef, useState, useMemo } from "react";
import { Button, Spinner, Table, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRangePicker } from "react-date-range";
import { formatSelectedDate } from "../utils/dateUtils";
import { downloadAsCSV } from "../utils/csvUtils";
import { AppointmentService } from "../_helpers";
import { useQuery, useQueryClient } from "react-query";

const AppointmentAllList = () => {
  const downloadRef = useRef(null);
  const queryClient = useQueryClient();

  const [filterAgent, setFilterAgent] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [titleDate, setTitleDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "date",
    },
  ]);

  const page = 1;
  const limit = 400;

  // Fetch appointments
  const retrieveAppointments = async (startDate, endDate, page, limit) => {
    try {
      const response = await AppointmentService.getAllAppointments(
        startDate,
        endDate,
        page,
        limit
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Query appointments
  const { data, isLoading, isError, error } = useQuery(
    [
      "Allappointments",
      selectedDate[0].startDate,
      selectedDate[0].endDate,
      page,
      limit,
    ],
    () =>
      retrieveAppointments(
        formatSelectedDate(selectedDate[0].startDate),
        formatSelectedDate(selectedDate[0].endDate),
        page,
        limit
      ),
    { cacheTime: 6000 }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["Allappointments", selectedDate]);
    }
  }, [isError, error, queryClient, selectedDate]);

  // Appointments data
  const appointments = data?.appointments || [];

  useEffect(() => {
    if (selectedDate.length > 0) {
      // const startDate = formatSelectedDate(selectedDate[0].startDate);
      const endDate = formatSelectedDate(selectedDate[0].endDate);

      // We can remove this redundant API call
      // retrieveAppointments(startDate, endDate, page, limit);
      setTitleDate(endDate);
    }
  }, [selectedDate]);

  const handleDateChange = (ranges) => {
    setSelectedDate([ranges.date]);
  };

  const handleButtonClick = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  const handleAgentFilterChange = (e) => {
    setFilterAgent(e.target.value);
  };

  const filteredAppointments = useMemo(() => {
    return appointments?.docs?.filter((item) => {
      if (
        filterAgent &&
        !item.userId?.firstName
          .toLowerCase()
          .includes(filterAgent.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [appointments?.docs, filterAgent]);

  // Render your UI with the optimized data
  // ...

  function convertirEnFrancais(status) {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmé";
      case "cancelled":
        return "Annulé";
      case "not-interested":
        return "Non intéressé";
      case "to-be-reminded":
        return "À rappeler";
      case "longest-date":
        return "Date éloignée";
      default:
        return status;
    }
  }

  function getBackgroundColor(status) {
    switch (status) {
      case "pending":
        return "text-green-900 bg-green-200";
      case "confirmed":
        return "text-blue-900 bg-blue-200";
      case "cancelled":
        return "text-red-900 bg-red-200";
      case "not-interested":
        return "text-gray-900 bg-gray-200";
      case "to-be-reminded":
        return "text-yellow-900 bg-yellow-200";
      case "longest-date":
        return "text-purple-900 bg-purple-200";
      default:
        return "";
    }
  }

  return (
    <>
      {/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg"> */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <div>
            <Button color="gray" size="xs" onClick={handleButtonClick}>
              Select a date range
            </Button>
            {showDatePicker && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                <div className="modal modal-open">
                  <div className="modal-box bg-white p-4 rounded-lg shadow-lg">
                    <div className="modal-header flex justify-end">
                      <Button color="gray" onClick={handleDatePickerClose}>
                        X
                      </Button>
                    </div>
                    <div className="modal-content mt-1">
                      <DateRangePicker
                        ranges={selectedDate}
                        onChange={handleDateChange}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        renderStaticRangeLabel={({ startDate, endDate }) =>
                          `${formatSelectedDate(
                            startDate
                          )} - ${formatSelectedDate(endDate)}`
                        }
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="xs"
                          color="gray"
                          onClick={handleDatePickerClose}
                        >
                          Fermer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            size="xs"
            color="light"
            ref={downloadRef}
            onClick={() => downloadAsCSV(appointments, titleDate)}
          >
            download as CSV
          </Button>

          <div className="text-gray-600">Count: {appointments?.totalDocs}</div>

          <div className="relative">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-gray-500"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </div>
            <TextInput
              id="search"
              type="text"
              className="block p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Filter by agent"
              autoComplete="off"
              value={filterAgent}
              onChange={handleAgentFilterChange}
            />
          </div>
        </div>

        <Table hoverable className="mt-3">
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>Agent</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Full Name</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Scheduling Date</Table.HeadCell>
            <Table.HeadCell>Sales Representative</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {filteredAppointments
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((appointment, index) => (
                <Table.Row
                  key={appointment._id}
                  className="bg-white text-xs dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell
                    style={{ whiteSpace: "nowrap", maxWidth: "2px" }}
                    className="whitespace-no-wrap front-medium text-gray-900 dark:text-white"
                  >
                    {appointment.userId?.firstName}
                  </Table.Cell>

                  <Table.Cell style={{ whiteSpace: "nowrap", maxWidth: "2px" }}>
                    {dayjs(appointment.createdAt).format("DD/MM")}
                  </Table.Cell>
                  <Table.Cell
                    className="whitespace-no-wrap front-medium text-gray-900 dark:text-white px-3 py-3 sm:px-4 overflow-auto"
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
                  <Table.Cell
                    className="px-3 py-3 sm:px-6  overflow-auto"
                    style={{ whiteSpace: "nowrap", maxWidth: "100px" }}
                  >
                    {appointment.commercial}
                  </Table.Cell>

                  {/* <Table.Cell>
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span
                        aria-hidden
                        className="absolute text-xs inset-0 bg-green-200 opacity-50 rounded-full"
                      ></span>
                      <span className="relative text-xs">
                        {appointment.status}
                      </span>
                    </span>
                  </Table.Cell> */}

<Table.Cell>
    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getBackgroundColor(appointment.status)}`}>
      <span aria-hidden className="absolute text-xs inset-0 opacity-50 rounded-full" />
      <span className="relative text-xs">{convertirEnFrancais(appointment.status)}</span>
    </span>
  </Table.Cell>

                  <Table.Cell
                    // className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    className="fornt-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    <Link to={`../appointments/edit/${appointment._id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.853 3.146a.5.5 0 010 .708L7.707 12.5l-1.5 6 6-1.5 8.646-8.646a.5.5 0 01.147-.338l1.5-1.5a.5.5 0 01.708 0l1.646 1.646a.5.5 0 010 .708L15.561 4.207a.5.5 0 01-.708 0l1.5-1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
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
    </>
  );
};

export { AppointmentAllList };
