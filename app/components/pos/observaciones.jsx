import { X } from "lucide-react";
import { useRef } from "react";
import { Toaster, toast } from 'sonner';

export default function Observaciones({ open, onClose, onObservacionesSubmit }) {
  const textareaRef = useRef(null);

  const handleAgregar = () => {
    const observaciones = textareaRef.current.value;
    onObservacionesSubmit(observaciones);

    toast.success('Observaciones Agregadas');
    setTimeout(() => {
      onClose(); 
    }, 1000);
  };

  return (
<div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="w-full">
          <div className="mx-5 my-4 w-full">
            <h2 className="text-xl font-bold flex gap-3 text-center dark:text-white">Agregar Observaciones</h2>
            <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
          </div>
          <label className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Observaciones:</label>
          <textarea ref={textareaRef} className="dark:bg-gray-900 dark:text-white modal-elem border rounded-md p-2 w-full h-15 focus:ring-blue-500 focus:border-blue-500"></textarea>
          <div className="flex justify-end gap-4">
            <button className="bg-green-600 font-semibold rounded-md py-2 px-6 text-white" onClick={handleAgregar}>Agregar</button>
            <button className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
