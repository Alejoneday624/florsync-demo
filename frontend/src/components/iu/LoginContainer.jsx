import NameApp from "./NameApp";

export default function LoginContainer({ children }) {
  return (
   <div
  className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    from-[#03624C]
    via-[#048C6A]
    to-[#014A3A]
    w-screen
  "
>
      {/* Nombre de la app arriba a la derecha de la card */}
      <div className="absolute top-4 right-6">
        <NameApp text="FlorSync Demo" />
      </div>

      {/* Aquí van los hijos de LoginContainer */}
      {children}
    </div>
  );
}