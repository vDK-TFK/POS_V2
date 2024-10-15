import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Editar({ open, onClose, productoId, mutate }) {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    PrecioCompra: '',
    PrecioVenta: '',
    Stock: '',
    CategoriaID: '',
    ProveedorID: '',
    FechaIngreso: '',
    FechaCaducidad: '',
    Estado: 'Vigente'
  });
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (productoId) {
      setIsLoading(true);
      setIsError(false);

      const fetchProducto = async () => {
        try {
          const response = await fetch(`/api/inventario/${productoId}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setFormData({
            Nombre: data.Nombre || '',
            Descripcion: data.Descripcion || '',
            PrecioCompra: data.PrecioCompra || '',
            PrecioVenta: data.PrecioVenta || '',
            Stock: data.Stock || '',
            CategoriaID: data.CategoriaID || '',
            ProveedorID: data.ProveedorID || '',
            FechaIngreso: data.FechaIngreso ? data.FechaIngreso.split('T')[0] : '',
            FechaCaducidad: data.FechaCaducidad ? data.FechaCaducidad.split('T')[0] : '',
            Estado: data.Estado || 'Vigente'
          });
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching producto:', error);
          setIsError(true);
          setIsLoading(false);
        }
      };

      const fetchCategorias = async () => {
        try {
          const response = await fetch(`/api/categorias`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setCategorias(data);
        } catch (error) {
          console.error('Error fetching categorias:', error);
        }
      };

      const fetchProveedores = async () => {
        try {
          const response = await fetch(`/api/proveedor`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setProveedores(data);
        } catch (error) {
          console.error('Error fetching proveedores:', error);
        }
      };

      fetchProducto();
      fetchCategorias();
      fetchProveedores();
    }
  }, [productoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    if (!productoId) {
      toast.error('Producto no encontrado');
      return;
    }

    try {
      const response = await fetch(`/api/inventario/${productoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          PrecioCompra: parseFloat(formData.PrecioCompra),
          PrecioVenta: parseFloat(formData.PrecioVenta),
          Stock: parseInt(formData.Stock, 10),
          CategoriaID: parseInt(formData.CategoriaID, 10),
          ProveedorID: parseInt(formData.ProveedorID, 10),
          FechaIngreso: formData.FechaIngreso ? new Date(formData.FechaIngreso).toISOString() : null,
          FechaCaducidad: formData.FechaCaducidad ? new Date(formData.FechaCaducidad).toISOString() : null
        }),
      });

      if (response.ok) {
        toast.success('Producto actualizado con éxito');
        mutate();  // Refresca los datos
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error('Error al actualizar el producto');
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
          <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100 my-4">
            Editar Producto ID : {productoId}
          </h2>
          <hr className="w-full border-t border-gray-300 dark:border-gray-600"></hr>
          <form onSubmit={handleEditar} className="ml-5 my-4 w-full">
            <div className="grid mr-5 gap-x-12 grid-cols-2">
              <div className="mb-4">
                <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
                <input required type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descripción</label>
                <input required type="text" id="Descripcion" name="Descripcion" value={formData.Descripcion} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="PrecioCompra" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Precio de Compra</label>
                <input required type="number" step="0.01" id="PrecioCompra" name="PrecioCompra" value={formData.PrecioCompra} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="PrecioVenta" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Precio de Venta</label>
                <input required type="number" step="0.01" id="PrecioVenta" name="PrecioVenta" value={formData.PrecioVenta} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="Stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
                <input required type="number" id="Stock" name="Stock" value={formData.Stock} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="CategoriaID" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Categoría</label>
                <select required id="CategoriaID" name="CategoriaID" value={formData.CategoriaID} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.CategoriaProductoID} value={categoria.CategoriaProductoID}>{categoria.NombreCategoria}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="ProveedorID" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Proveedor</label>
                <select required id="ProveedorID" name="ProveedorID" value={formData.ProveedorID} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>{proveedor.Nombre}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="FechaIngreso" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fecha de Ingreso</label>
                <input required type="date" id="FechaIngreso" name="FechaIngreso" value={formData.FechaIngreso} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="FechaCaducidad" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fecha de Caducidad</label>
                <input type="date" id="FechaCaducidad" name="FechaCaducidad" value={formData.FechaCaducidad} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mr-5">
              <button type="submit" className="bg-green-500 font-semibold rounded-md py-2 px-6 text-white">Guardar</button>
              <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
