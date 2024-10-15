import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Cliente({ open, onClose }) {
  const handleClienteGuardar = () => {
    toast.success('Cliente incluido correctamente');
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
            <h2 className="text-xl font-bold flex gap-3 text-center dark:text-gray-100">Agregar nuevo cliente</h2>
            <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
          </div>
          
          <div className="grid mr-5 mb-5 gap-x-12 grid-cols-2">
            <div className="lg:w-full w-full ml-2 mr-2">
                <label htmlFor="montoPago" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-100">Nombre:</label>
                <input type="text" id="montoPago" className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-100" />
            </div>

            <div className="lg:w-full w-full ml-2 mr-2">
                <label htmlFor="montoVuelto" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-100">Correo:</label>
                <input type="text" id="montoVuelto" className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
          </div>

          <div className="grid mr-5 mb-5 gap-x-12 grid-cols-2">
            <div className="lg:w-full w-full ml-2 mr-2">
                <label htmlFor="montoVuelto" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-100">Teléfono:</label>
                <input type="text" id="montoVuelto" className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>

            <div className="lg:w-full w-full ml-2 mr-2">
                <label htmlFor="montoVuelto" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-100">Celular:</label>
                <input type="text" id="montoVuelto" className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
          </div>

          <div className="grid mr-5 mb-5 gap-x-12 grid-cols-1">
            <div className="lg:w-full w-full ml-2 mr-2">
                <label htmlFor="montoVuelto" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-100">Dirección:</label>
                <input type="text" id="montoVuelto" className="dark:bg-gray-900 dark:text-white bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
          </div>



          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-4">
              <button className="bg-green-600 font-semibold rounded-md py-2 px-6 text-white" onClick={handleClienteGuardar}>Guardar</button>
              <button className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
     
    </div>

    
  );
}
 