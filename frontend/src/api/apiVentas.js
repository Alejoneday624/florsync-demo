import api from "./axios";

// Configuración de reintentos automáticos
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

// Función para esperar un período antes de reintentar
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const registrarVenta = async (ventaData) => {
  try {
    console.log("📤 Enviando datos a la API:", ventaData);

    const response = await api.post(
      "/ventas/realizar-ventas/",
      ventaData
    );

    console.log("📥 Respuesta de la API:", response.data);

    return response.data;

  } catch (error) {
    console.error("🔥 Error en registrarVenta:", error);

    throw new Error(
      JSON.stringify(
        error.response?.data || "Error al registrar la venta"
      )
    );
  }
};


export const obtenerVentas = async (fecha) => {
  try {
    const params = fecha ? { fecha } : {};

    const response = await api.get(
      "/ventas/obtener_ventas/",
      { params }
    );

    return response.data;

  } catch (error) {
    console.error("🔥 Error al obtener ventas:", error);

    throw new Error(
      JSON.stringify(
        error.response?.data || "Error al obtener las ventas"
      )
    );
  }
};


export const obtenerDashboard = async (view = "week", offset = 0) => {
  let ultimoError = null;

  for (let intento = 1; intento <= MAX_RETRIES; intento++) {
    try {
      const response = await api.get("/ventas/dashboard/", {
        params: { view, offset },
      });
      return response.data;
    } catch (error) {
      ultimoError = error;

      // Errores 4xx: el backend respondió, reintentar no ayudaría
      const status = error.response?.status;
      const esErrorCliente = status >= 400 && status < 500;
      if (esErrorCliente) break;

      console.warn(`⚠️ Intento ${intento}/${MAX_RETRIES} fallido para obtenerDashboard`);

      if (intento < MAX_RETRIES) {
        await delay(RETRY_DELAY * intento); // Backoff simple
      }
    }
  }

  // Todos los reintentos fallaron
  throw new Error(
    JSON.stringify(
      ultimoError.response?.data || "Error al obtener los datos del dashboard. El backend podría estar caído."
    )
  );
};