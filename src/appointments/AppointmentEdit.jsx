import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AppointmentService, customHistory } from "../_helpers";
import { useQuery, useQueryClient } from "react-query";
import { Spinner } from "flowbite-react";

const AppointmentEdit = () => {
  const { id: appointmentId } = useParams();
  const queryClient = useQueryClient();

  const [appointmentData, setAppointmentData] = useState({
    date: dayjs().format("YYYY-MM-DDTHH:mm"),
    name: "",
    status: "",
    comment: "",
    address: "",
    commercial: "",
    phone_1: "",
    phone_2: "",
  });

  const updateAppointment = async (appointmentId, data) => {
    try {
      const response = await AppointmentService.updateAppointment(
        appointmentId,
        data
      );
      customHistory.navigate(-1);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await AppointmentService.deleteAppointment(
        appointmentId
      );
      customHistory.navigate(-1);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery(
    ["appointmentById", appointmentId],
    () =>
      AppointmentService.getAppointmentById(appointmentId)
        .then((response) => response.data)
        .catch((err) => console.log("err", err)),
    { cacheTime: 6000 }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointmentById", appointmentId]);
    }
  }, [isError, error, queryClient, appointmentId]);

  const appointment = useMemo(() => data?.appointment || {}, [data]);

  useEffect(() => {
    if (appointment) {
      setAppointmentData((prevState) => ({
        ...prevState,
        ...appointment,
        date: dayjs(appointment.date).format("YYYY-MM-DD"),
      }));
    }
  }, [appointment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAppointment(appointmentId, appointmentData);
  };

  const handleDelete = () => {
    deleteAppointment(appointmentId);
  };

  const handleCancel = () => {
    customHistory.navigate("/admin");
  };

  return (
    <div className="bg-white border border-4 rounded-lg shadow relative m-10">
      {isLoading && (
        <div className="text-center">
          <Spinner aria-label="Default status example" size="xl" />
        </div>
      )}
      <div className="flex items-start justify-between p-5 border-b rounded-t">
        <h3 className="text-xl font-semibold">Edit appointment</h3>
      </div>
      <div className="flex items-start justify-between p-5 border-b rounded-t">
        <p className="text-sm">Rdv pris par {appointment?.userId?.firstName}</p>
      </div>

      {/* <div className */}
      <div className="p-5">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={appointmentData.status}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select status</option>
                <option value="confirmed">Confirmé</option>
                <option value="pending">En Attente</option>
                <option value="cancelled">Annulé</option>
                <option value="not-interested">Pas Intéressé</option>
                <option value="to-be-reminded">A Rappeler</option>
                <option value="longest-date">Date Eloignée</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="commercial"
                className="block text-sm font-medium text-gray-700"
              >
                Sales Representative
              </label>

              <select
                type="text"
                name="commercial"
                id="commercial"
                autoComplete="off"
                value={appointmentData.commercial}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              >
                <option value="">Select Sales Representative</option>
                <option value="annabelle-rodriguez">Annabelle Rodriguez</option>
                <option value="benoit-chamboissier">Benoît Chamboissier</option>
                <option value="fatima-Jabri">Fatima Jabri</option>
                <option value="freddy-tamboers">Freddy Tamboers</option>
                <option value="julien-morel">Julien Morel</option>
                <option value="theo-raymond">Théo Raymond</option>
                <option value="aurore-diallo">Aurore Diallo</option>
                <option value="mathieu-renault">Mathieu Renault</option>
                <option value="simon-cadenne">Simon Cadenne</option>
                <option value="sophie-rousmans">Sophie Rousmans</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={appointmentData.name}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={appointmentData.date}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={appointmentData.time}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone_1"
                className="block text-sm font-medium text-gray-700"
              >
                Phone (fixe)
              </label>
              <input
                type="text"
                id="phone_1"
                name="phone_1"
                value={appointmentData.phone_1}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone_2"
                className="block text-sm font-medium text-gray-700"
              >
                Phone (mobile)
              </label>
              <input
                type="text"
                id="phone_2"
                name="phone_2"
                value={appointmentData.phone_2}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={appointmentData.address}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={appointmentData.comment}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentEdit;
