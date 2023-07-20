import React, { useEffect, useMemo, useState } from "react";
import {  useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AppointmentService, customHistory } from "../_helpers";
import { useQuery, useQueryClient } from "react-query";
import { Spinner } from "flowbite-react";

const AppointmentEdit = () => {
  const { id: appointmentId } = useParams();
  const queryClient = useQueryClient();

  const [appointmentData, setAppointmentData] = useState({
    date: dayjs().format("YYYY-MM-DDTHH:mm"), // Use "T" instead of space for datetime-local input
    name: "",
    status: "",
    comment: "",
    address: "",
    commercial: "",
    phone_1: "",
    phone_2: "",
  });

  // Fetch appointment
  const retrieveAppointment = async (appointmentId) => {
    try {
      const response = await AppointmentService.getAppointmentById(
        appointmentId
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Update appointment
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
  // Update appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await AppointmentService.deleteAppointment(
        appointmentId
      );
      customHistory.navigate(-1)
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Query appointments
  const { data, isLoading, isError, error } = useQuery(
    ["appointment", appointmentId],
    () => retrieveAppointment(appointmentId),
    { cacheTime: 6000 }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointment", appointmentId]);
    }
  }, [isError, error, queryClient, appointmentId]);

  // Appointments data
  const appointment = useMemo(()=> data?.appointment || {}, [data]);

  useEffect(() => {
    // Mettre à jour les champs du formulaire avec les données du rendez-vous
    if (appointment) {
      setAppointmentData({
        ...appointment,
        date: dayjs(appointment.date).format("YYYY-MM-DDTHH:mm")
      });
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
    // update appointment
    updateAppointment(appointmentId, appointmentData);
  };

  const handleDelete = () => {
    // Add logic for "Supprimé" (Delete) button action if needed
    deleteAppointment(appointmentId);
  };

  const handleCancel = () => {
    // Add logic for "Annulé" (Cancel) button action if needed
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

      <div className="p-6 space-y-6">
        <form>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Status
              </label>
              <select
                type="text"
                name="status"
                id="status"
                autoComplete="off"
                value={appointmentData.status}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              >
                <option value="">Select Status</option>
                <option value="pending">En Attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="not-interested">Pas Intéressé</option>
                <option value="to-be-reminded">A Rappeler</option>
                <option value="longest-date">Date Eloignée</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="commercial"
                className="text-sm font-medium text-gray-900 block mb-2"
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
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              >
                <option value="">Select Sales Representative</option>
                <option value="Annabelle Rodriguez">Annabelle Rodriguez</option>
                <option value="Benoit Chamboissier">Benoît Chamboissier</option>
                <option value="Freddy Tamboers">Freddy Tamboers</option>
                <option value="Julien Morel">Julien Morel</option>
                <option value="Théo Raymond">Théo Raymond</option>
                <option value="Aurore Diallo">Aurore Diallo</option>
                <option value="Simon Cadenne">Simon Cadenne</option>
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Appointment Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                value={appointmentData.name}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Appointment Date
              </label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                autoComplete="off"
                value={appointmentData.date}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone_1"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Phone (fixe)
              </label>
              <input
                type="text"
                name="phone_1"
                id="phone_1"
                autoComplete="off"
                value={appointmentData.phone_1}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone_2"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Phone (mobile)
              </label>
              <input
                type="text"
                name="phone_2"
                id="phone_2"
                autoComplete="off"
                value={appointmentData.phone_2}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="off"
                value={appointmentData.address}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
              />
            </div>
            <div className="col-span-full">
              <label
                htmlFor="comment"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Appointment Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                autoComplete="off"
                value={appointmentData.comment}
                onChange={handleInputChange}
                rows="6"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-gray-200 rounded-b space-x-4">
        <button
          className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5"
          type="submit"
          onClick={handleSubmit}
        >
          Update
        </button>
        <button
          className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5"
          type="button"
          onClick={handleDelete}
        >
          Supprimé
        </button>
        <button
          className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
          type="button"
          onClick={handleCancel}
        >
          Annulé
        </button>
      </div>
    </div>
  );
};

export default AppointmentEdit;
