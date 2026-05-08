import API from "../lib/axios";

export const getServicesAPI = async (params = {}) => {
  const response = await API.get("/services", { params });
  return response.data;
};

export const getServiceAPI = async (serviceId) => {
  const response = await API.get(`/services/${serviceId}`);
  return response.data;
};

export const createServiceAPI = async (data) => {
  const response = await API.post("/services", data);
  return response.data;
};

export const updateServiceAPI = async (serviceId, data) => {
  const response = await API.patch(`/services/${serviceId}`, data);
  return response.data;
};

export const deleteServiceAPI = async (serviceId) => {
  const response = await API.delete(`/services/${serviceId}`);
  return response.data;
};
