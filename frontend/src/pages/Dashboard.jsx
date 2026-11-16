import { useEffect, useState } from "react";

import SummaryCards from "../components/iu/SummaryCards";
import SalesChart from "../components/iu/SalesChart";
import TopProductsChart from "../components/iu/TopProductsChart";
import SellerChart from "../components/iu/SellerChart";
import LowStockAlert from "../components/iu/LowStockAlert";
import Filters from "../components/iu/Filters";
import { obtenerDashboard } from "../api/apiVentas";

export default function Dashboard() {
  const [view, setView] = useState("week");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Reset offset al cambiar de vista
  const handleSetView = (v) => {
    setView(v);
    setOffset(0);
  };

  useEffect(() => {
    let activo = true;
    obtenerDashboard(view, offset)
      .then((d) => activo && setData(d))
      .catch((e) => activo && setError(e.message));
    return () => {
      activo = false;
    };
  }, [view, offset]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <h2 className="font-bold mb-2">No se pudieron cargar los datos</h2>
          <p className="text-sm">
            ¿Está corriendo el backend? Inicia el servidor Django en{" "}
            <code className="bg-red-100 px-1 rounded">http://127.0.0.1:8000</code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-6 text-gray-600">Cargando datos...</div>;

  const periodLabel =
    view === "day"
      ? data.period?.start
      : view === "week"
      ? `${data.period?.start} — ${data.period?.end}`
      : data.period?.start?.slice(0, 7);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Datos de ejemplo
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-6">
        <Filters view={view} setView={handleSetView} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            ◀
          </button>
          <span className="text-sm font-medium">{periodLabel}</span>
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <SummaryCards summary={data.summary} />
        <LowStockAlert productos={data.low_stock || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <SalesChart data={data} view={view} />
        <TopProductsChart products={data.top_products} />
      </div>

      <div className="bg-white rounded-2xl shadow p-4 md:p-6">
        <h2 className="font-bold mb-4">Ventas por vendedor</h2>
        <SellerChart data={data.top_sellers || []} />
      </div>
    </div>
  );
}
