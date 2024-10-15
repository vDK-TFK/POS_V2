import { useState, useEffect } from 'react';
import { X, CircleAlert } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Eliminar({ open, onClose, productoId, mutate }) {
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (productoId) {
      setIsLoading(true);
      setIsError(false);

      fetch(`/api/inventario/${productoId}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          setProducto(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching producto:', error);
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [productoId]);

  const handleEliminar = async () => {
    try {
      const response = await fetch(`/api/inventario/${productoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Producto eliminado con éxito');
        mutate();  // Refresca los datos
        setTimeout(() => {
          onClose(); // Cierra el modal después de mostrar la notificación
        }, 1500);
      } else {
        toast.error('Error al eliminar el producto');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  if (isLoading) {
    return (
      <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
          <p className="text-center text-gray-700 dark:text-gray-200">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
          <p className="text-center text-gray-700 dark:text-gray-200">Error al cargar los datos del producto.</p>
        </div>
      </div>
    );
  }

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
            ¿Seguro que desea eliminar este producto?
          </p>
          <div className="w-full">
            <div className="flex gap-2 my-2">
              <p className="text-gray-800 dark:text-gray-200 text-md font-bold">Id:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.ProductoID}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Nombre:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.Nombre}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Descripción:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.Descripcion}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Estado:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.Estado}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Proveedor:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.ProveedorID}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Cantidad:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.Stock}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Fecha ingreso:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.FechaIngreso ? new Date(producto.FechaIngreso).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex gap-2 my-2">
              <p className="text-md text-gray-800 dark:text-gray-200 font-bold">Categoría:</p>
              <p className="text-gray-800 dark:text-gray-200 text-md">{producto?.CategoriaID}</p>
            </div>
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
