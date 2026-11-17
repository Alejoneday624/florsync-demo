import { useNavigate } from "react-router-dom";
import LoginContainer from "../components/iu/LoginContainer";
import Carousel from "../components/iu/Caurousel";
import Title from "../components/iu/Title";
import Button from "../components/iu/Button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <div className="flex flex-col md:flex-row w-full h-full gap-2 md:gap-4">
        {/* Columna izquierda: carrusel de flores */}
        <div className="hidden md:block w-full md:w-[55%] h-auto md:h-full max-h-full overflow-hidden rounded-lg">
          <Carousel />
        </div>

        {/* Columna derecha: presentación + botón de demo */}
        <div className="w-full md:w-[45%] flex justify-center items-center overflow-auto px-4 md:px-0">
          <div className="flex flex-col justify-center items-center gap-6 text-white text-center max-w-sm">
            <Title text="FlorSync Demo" />

            <p className="text-white/80 text-lg md:text-xl">
              Sistema de gestión de florería
            </p>

            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-400 text-amber-950">
              Demo pública · sin login
            </span>

            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full px-8 py-3 text-lg font-bold bg-[#00DF82] text-[#021716] hover:bg-[#00B96B] transition rounded-xl shadow-lg"
            >
              PROBAR DEMO
            </Button>

            <p className="text-white/50 text-xs">
              Los datos son de ejemplo. Puedes restablecerlos en cualquier
              momento desde el menú superior.
            </p>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
}
