"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function Logout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut({ redirect: false }); // No redirigir automáticamente
        setTimeout(() => {
          setIsLoading(false); // Mostrar el mensaje de cierre de sesión
          window.location.href = "/auth/login"; // Redirigir manualmente
        }, 100); // Esperar 1 segundo antes de redirigir
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    logout();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="text-center">
        {isLoading ? (
          <>
            <ClipLoader speedMultiplier={1.5} size={70} color={"#000000"} />
            <p className="mt-4 text-lg">Cerrando sesión...</p>
          </>
        ) : (
          <>
            <ClipLoader speedMultiplier={1.5} size={70} color={"#000000"} />
            <p className="mt-4 text-lg">Cerrando sesión...</p>
          </>
        )}
      </div>
    </div>
  );
}
