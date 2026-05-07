import api from "./api";

export const getSpecialties = () => 
 api.get("/specializations");

export const createSpecialty = (data) =>
 api.post("/specializations", data, {});

export const updateSpecialty = (id, data) =>
  api.post(`/specializations/${id}?_method=PUT`, data, {});

export const activateSpecialty = (id) =>
  api.patch(`/specializations/${id}/activate`);

export const disableSpecialty = (id) =>
  api.patch(`/specializations/${id}/disable`);
