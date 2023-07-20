import { instanceHttp } from "./instanceAxios";

const getAllAppointments = (startDate, endDate,page, limit) => {
  return instanceHttp.get(
    `appointments?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
  );
};
const getAppointmentById = (id) => {
  return instanceHttp.get(`appointments/${id}`);
};
const getAppointmentsByUserId = (userId, date, page, limit) => {
  return instanceHttp.get(`appointments/user/${userId}?date=${date}&page=${page}&limit=${limit}`);
};
const getAllAppointmentsByWeek = (date) => {
  return instanceHttp.get(`appointments/week?week=${date}`);
};
const createAppointment = (userId, data) => {
  return instanceHttp.post(`appointments/${userId}`, data);
};
const updateAppointment = (id, data) => {
  return instanceHttp.put(`appointments/${id}`, data);
};
const deleteAppointment = (id) => {
  return instanceHttp.delete(`appointments/${id}`);
};

export const AppointmentService = {
  getAllAppointments,
  getAllAppointmentsByWeek,
  getAppointmentById,
  getAppointmentsByUserId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
