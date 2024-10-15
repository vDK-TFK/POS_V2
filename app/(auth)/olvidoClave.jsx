"use client";
import React, { useState } from "react";
import { CircleAlert, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { resetPassword } from "@/app/api/auth/resetPassword/resetPassword";

export default function CambiarClave({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleCambioClave = async () => {
    const message = await resetPassword(email);
    setMessage(message);
    toast.success('Se ha enviado una nueva clave a su correo');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (

    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="w-full">
          <div className="mx-5 my-4 w-full">
            <h2 className="text-xl font-bold flex gap-3 text-center text-black dark:text-white"><CircleAlert />Cambio de Clave</h2>
            <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
          </div>

          <div className="grid mr-5 mb-5 gap-x-12 grid-cols-1">
            <div className="lg:w-full w-full ml-2 mr-2">
              <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Correo del usuario:</label>
              <input
                type="email"
                id="email"
                className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="bg-green-600 font-semibold rounded-md py-2 px-6 text-white" onClick={handleCambioClave}>Enviar</button>
            <button className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
          </div>
        </div>
        <Toaster richColors />
      </div>
    </div>
  );
}
