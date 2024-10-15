import { useState, useEffect } from 'react';
import { X, CircleAlert } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Eliminar({ open, onClose, proveedorId, mutate }) {
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    if (proveedorId) {
      fetch(`/api/proveedor/${proveedorId}`)
        .then(response => response.json())
        .then(data => setProveedor(data))
        .catch(error => {
          console.error('Error fetching proveedor:', error);
          toast.error('Error al cargar los datos del proveedor');
        });
    }
  }, [proveedorId]);

  const handleEliminar = async () => {
    try {
      const response = await fetch(`/api/proveedor/${proveedorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Proveedor eliminado con éxito');
        mutate();  // Refresca los datos
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const result = await response.json();
        toast.error(result.error || 'Error al eliminar el proveedor');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  if (!proveedor) return null;

  return (
    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-3 text-red-500 my-4 dark:text-red-400">
            <CircleAlert size={24} strokeWidth={2} />Confirmar eliminación
          </h2>
          <hr className="w-full border-t border-gray-300 dark:border-gray-600"></hr>
          <p className="text-md text-gray-800 my-4 dark:text-gray-200">
            ¿Seguro que desea eliminar este proveedor?
          </p>
          <div className="ml-5 my-4 w-full">
            <dl className="grid grid-cols-2 gap-x-4">
              <div className="mb-4">
                <dt className="text-sm font-medium dark:text-gray-200 text-gray-700">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.ProveedorID}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Nombre}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Sitio Web</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Contacto}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Telefono}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Tipo</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Tipo}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Correo</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Email}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{proveedor.Direccion}</dd>
              </div>
            </dl>
          </div>
          <div className="flex justify-end gap-4 w-full mt-4">
            <button className="bg-red-600 text-white font-semibold rounded-md py-2 px-6 hover:bg-red-700 dark:hover:bg-red-800" onClick={handleEliminar}>
              Eliminar
            </button>
            <button className="bg-gray-400 text-white font-semibold rounded-md py-2 px-6 hover:bg-gray-500 dark:hover:bg-gray-600" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
