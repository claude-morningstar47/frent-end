// import { instanceHttp } from "./instanceAxios";

// const getAllAppointments = (startDate, endDate,page, limit) => {
//   return instanceHttp.get(
//     `appointments?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
//   );
// };
// const getAppointmentById = (id) => {
//   return instanceHttp.get(`appointments/${id}`);
// };
// const getAppointmentsByUserId = (userId, date, page, limit) => {
//   return instanceHttp.get(`appointments/user/${userId}?date=${date}&page=${page}&limit=${limit}`);
// };
// const getAllAppointmentsByWeek = (date) => {
//   return instanceHttp.get(`appointments/week?week=${date}`);
// };
// const createAppointment = (userId, data) => {
//   return instanceHttp.post(`appointments/${userId}`, data);
// };
// const updateAppointment = (id, data) => {
//   return instanceHttp.put(`appointments/${id}`, data);
// };
// const deleteAppointment = (id) => {
//   return instanceHttp.delete(`appointments/${id}`);
// };

// export const AppointmentService = {
//   getAllAppointments,
//   getAllAppointmentsByWeek,
//   getAppointmentById,
//   getAppointmentsByUserId,
//   createAppointment,
//   updateAppointment,
//   deleteAppointment,
// };
import { instanceHttp } from "./instanceAxios";

export const AppointmentService = {
  getAllAppointments: (startDate, endDate, page, limit) =>
    instanceHttp.get(`appointments?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`),
  
  getAppointmentById: (id) =>
    instanceHttp.get(`appointments/${id}`),
  
  getAppointmentsByUserId: (userId, date, page, limit) =>
    instanceHttp.get(`appointments/user/${userId}?date=${date}&page=${page}&limit=${limit}`),
  
  getAllAppointmentsByWeek: (date) =>
    instanceHttp.get(`appointments/week?week=${date}`),
  
  createAppointment: (userId, data) =>
    instanceHttp.post(`appointments/${userId}`, data),
  
  updateAppointment: (id, data) =>
    instanceHttp.put(`appointments/${id}`, data),
  
  deleteAppointment: (id) =>
    instanceHttp.delete(`appointments/${id}`)
};