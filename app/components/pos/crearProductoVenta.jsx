import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Agregar({ open, onClose }) {
  const handleAgregar = () => {
    toast.success('Producto Registrado Satisfactoriamente');
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
                    <h2 className="text-2xl font-bold flex gap-3 text-center text-gray-900 dark:text-white">Agregar Producto Venta</h2>
                    <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
                    
                </div>
                <form onSubmit={handleAgregar} className="ml-5 my-4 w-full">

                    <div className="grid mr-5 gap-x-12 grid-cols-2">
                        <div className="mb-4 ">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700  dark:text-white">Nombre</label>
                        <input  type="text" id="nombre" name="nombre" className="dark:bg-gray-900 dark:text-white mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div className="mb-4">
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-white">Imagen</label>
                        <input  type="file" id="tipo" name="tipo" className="dark:bg-gray-900 dark:text-white mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-white">Precio</label>
                        <input type="number" id="precio" name="precio" className="dark:bg-gray-900 dark:text-white mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-white">Cant. para la venta</label>
                        <input type="number" id="precio" name="precio" className="dark:bg-gray-900 dark:text-white mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        
                    </div>
                    
                    <div className="flex justify-end gap-4 mr-5 ">
                    <button type="submit" className="bg-verde font-semibold rounded-md py-2 px-6 text-white">Agregar
                    </button>
                    <button type="button" 
                        className="bg-gray-400 font-semibold   rounded-md py-2 px-6"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    </div>


                </form>
                    
                </div>
          </div>   
          <Toaster richColors/>
         
  </div>
);
}