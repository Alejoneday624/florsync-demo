import api from "./axios";

export const obtenerCategorias = async () => {
  const res = await api.get("/categorias/");
  return res.data;
};

export const crearCategoria = async (data) => {
  const res = await api.post("/categorias/", data);
  return res.data;
};

export const actualizarCategoria = async (id, data) => {
  const res = await api.put(`/categorias/${id}/`, data); // usa id directo
  return res.data;
};

export const eliminarCategoria = async (id) => {
  const res = await api.delete(`/categorias/${id}/`); // usa id directo
  return res.data;
};

