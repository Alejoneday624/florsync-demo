// src/api/axios.js — instancia HTTP de la demo (sin autenticación)

import axios from "axios";

const api = axios.create({
    // En desarrollo apunta al proxy de Vite (/api → localhost:8000).
    // En producción se sirve desde el mismo dominio, así que basta "/api/".
    baseURL: import.meta.env.VITE_API_URL || "/api/",
    timeout: 15000,
});

export default api;
