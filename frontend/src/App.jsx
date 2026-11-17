import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/RealizaVentas";
import VentasMostrar from "./pages/VisualizarVentas";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

// La demo no tiene login: cualquiera puede entrar y probar todo.
export default function App() {
  return (
    <Routes>
      {/* Pantalla de inicio con botón "PROBAR DEMO" */}
      <Route path="/" element={<Landing />} />

      {/* Secciones de la app */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas/nueva" element={<Ventas />} />
        <Route path="/ventas/historial" element={<VentasMostrar />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/categorias" element={<Categorias />} />
      </Route>

      {/* Cualquier otra ruta vuelve al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
