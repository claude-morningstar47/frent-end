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
import { convertirEnFrancais, getBackgroundColor } from "../utils/statusStyle";

const formatCommercialName = (name) => {
  const words = name.split("-");
  const formattedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedName;
};

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

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRowClick = (appointment) => {
    setSelectedItem(appointment);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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

        <Table hoverable className="">
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>Agent</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Doctor</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            {/* <Table.HeadCell>Address</Table.HeadCell> */}
            <Table.HeadCell>Appointment date</Table.HeadCell>
            <Table.HeadCell>Sales Representative</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {filteredAppointments
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((appointment, index) => (
                <Table.Row
                  key={appointment._id}
                  className="bg-white text-xs dark:border-gray-700 dark:bg-gray-800"
                  onClick={() => handleRowClick(appointment)}
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
                    // style={{ whiteSpace: "nowrap", maxWidth: "120px" }}
                  >
                    {appointment.phone_1 && appointment.phone_2
                      ? `${appointment.phone_1} / ${appointment.phone_2}`
                      : appointment.phone_1 || appointment.phone_2}
                  </Table.Cell>

                  {/* <Table.Cell
                    className="px-3 py-3 sm:px-6  overflow-auto"
                    style={{ whiteSpace: "nowrap", maxWidth: "120px" }}
                  >
                    {appointment.address.toLowerCase()}
                  </Table.Cell> */}
                  <Table.Cell>
                    {dayjs(appointment.date).format("DD/MM/YY")},{" "}
                    {appointment.time}
                  </Table.Cell>
                  <Table.Cell
                    className="overflow-auto"
                    style={{ whiteSpace: "nowrap", maxWidth: "80px" }}
                  >
                    {formatCommercialName(appointment.commercial)}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getBackgroundColor(
                        appointment.status
                      )}`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <span
                        aria-hidden
                        className="absolute text-xs inset-0 opacity-50"
                      />
                      {convertirEnFrancais(appointment.status)}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}

            {isPopupOpen && selectedItem && (
              <div
                className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 ${
                  isPopupOpen ? "block" : "hidden"
                }`}
              >
                <div className="bg-white p-4 rounded shadow-md">
                  <p className="mb-2 text-lg font-semibold">
                    Options pour l'élément sélectionné :
                  </p>
                  <p>
                    <span className="font-semibold">Agent:</span>{" "}
                    {selectedItem && selectedItem.userId?.firstName}
                  </p>
                  <p>
                    <span className="font-semibold">Docteur:</span>{" "}
                    {selectedItem && selectedItem.name?.toUpperCase()}
                  </p>
                  <p>
                    <span className="font-semibold">Date programmation:</span>{" "}
                    {selectedItem &&  dayjs(selectedItem.date).format("DD/MM/YY")}, {selectedItem && selectedItem.time}
                  </p>
                  <p>
                    <span className="font-semibold">Fixe:</span>{" "}
                    {selectedItem && selectedItem.phone_1 }
                  </p>
                  <p>
                    <span className="font-semibold">Mobile:</span>{" "}
                    {selectedItem && selectedItem.phone_2 }
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedItem && selectedItem.status}
                  </p>
                  <p>
                    <span className="font-semibold">Commercial:</span>{" "}
                    {selectedItem && selectedItem.commercial}
                  </p>

                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {selectedItem && selectedItem.address?.toLowerCase()}
                  </p>
                  <p  > 
                    <span className="font-semibold">Commentaire:</span>{" "}
                    {selectedItem && selectedItem.comment?.toLowerCase()}
                  </p>
                 

                  <div className="mt-4 flex justify-end">
                      <Link to={`../appointments/edit/${selectedItem._id}`}
                      className="mr-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                      Éditer
                      </Link>

                    <button
                      className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
                      onClick={() => handleClosePopup()}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
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
