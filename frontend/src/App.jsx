import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/RealizaVentas";
import VentasMostrar from "./pages/VisualizarVentas";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Dashboard from "./pages/Dashboard";

// La demo no tiene login: cualquiera entra directo a las secciones.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas/nueva" element={<Ventas />} />
        <Route path="/ventas/historial" element={<VentasMostrar />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/categorias" element={<Categorias />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
