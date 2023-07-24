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