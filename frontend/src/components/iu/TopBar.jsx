import { Menu, RotateCcw, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import routeTitles from "../../data/routeTitles";

export default function TopBar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [reseteando, setReseteando] = useState(false);
  const menuRef = useRef(null);

  const title = routeTitles[location.pathname] || "FlorSync";

  // Cerrar menú si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restaura los datos de ejemplo de la demo
  const handleReset = async () => {
    const confirmar = window.confirm(
      "¿Restablecer los datos de la demo? Se borrarán los cambios que hayas hecho y volverán los datos de ejemplo."
    );
    if (!confirmar) return;

    try {
      setReseteando(true);
      await api.post("/demo/reset/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("No se pudieron restablecer los datos. ¿Está corriendo el backend?");
      setReseteando(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-gradient-to-br from-[#032221] via-[#044A45] to-[#021716] text-white flex items-center justify-between px-4 z-50 shadow">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-transparent"
          aria-label="Abrir menú"
        >
          <Menu size={26} />
        </button>

        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>

      {/* DERECHA - MODO DEMO */}
      <div className="relative flex items-center gap-3" ref={menuRef}>
        <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-amber-950">
          Modo demo · sin login
        </span>

        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="w-9 h-9 rounded-full bg-white text-[#044A45] flex items-center justify-center font-bold"
          aria-label="Opciones de la demo"
        >
          ?
        </button>

        {openMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg overflow-hidden">

            <div className="px-4 py-2 border-b text-sm text-gray-600">
              Demo pública
              <div className="text-xs text-gray-400">
                Cualquiera puede probar todo
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={reseteando}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-60"
            >
              <RotateCcw size={16} />
              {reseteando ? "Restableciendo..." : "Restablecer datos"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 border-t"
            >
              <Home size={16} />
              Volver al inicio
            </button>
          </div>
        )}
      </div>

    </header>
  );
}
