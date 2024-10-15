import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Editar({ open, onClose, categoriaId, mutate }) {
  const [formData, setFormData] = useState({
    NombreCategoria: '',
    Descripcion: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (categoriaId) {
      setIsLoading(true);
      setIsError(false);
      fetch(`/api/categorias/${categoriaId}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            NombreCategoria: data.NombreCategoria || '',
            Descripcion: data.Descripcion || '',
          });
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching categoría:', error);
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [categoriaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    if (!categoriaId) {
      toast.error('Categoría no encontrada');
      return;
    }

    try {
      const response = await fetch(`/api/categorias/${categoriaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Categoría actualizada con éxito');
        mutate();  // Refresca los datos
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error('Error al actualizar la categoría');
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
          <p className="text-center text-gray-700 dark:text-gray-200">Error al cargar los datos de la categoría.</p>
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
          <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100 my-4">
            Editar Categoría ID : {categoriaId}
          </h2>
          <hr className="w-full border-t border-gray-300 dark:border-gray-600"></hr>
          <form onSubmit={handleEditar} className="ml-5 my-4 w-full">
            <div className="grid mr-5 gap-x-12 grid-cols-2">
              <div className="mb-4">
                <label htmlFor="NombreCategoria" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
                <input required type="text" id="NombreCategoria" name="NombreCategoria" value={formData.NombreCategoria} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descripción</label>
                <input type="text" id="Descripcion" name="Descripcion" value={formData.Descripcion} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mr-5">
              <button type="submit" className="bg-verde font-semibold rounded-md py-2 px-6 text-white">Guardar</button>
              <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
