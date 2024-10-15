import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Anular({ open, onClose }) {

  const handleAgregar = () => {
    toast.success('Factura Anulada Satisfactoriamente');
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
            <h2 className="text-xl font-bold flex gap-3 text-center dark:text-white">Anular Documento</h2>
            <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
          </div>
          <p className="font-semibold mb-10 ml-5  dark:text-white">¿Desea anular este documento?</p>


          <div className="flex justify-end gap-4">
            <button className="bg-green-600 font-semibold rounded-md py-2 px-6 text-white" onClick={handleAgregar}>Anular</button>
            <button className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
