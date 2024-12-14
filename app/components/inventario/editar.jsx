import { useState, useEffect } from 'react';
import { Pencil, X } from "lucide-react";
import { toast } from 'sonner';
import ModalTemplate from '../HtmlHelpers/ModalTemplate';
import HtmlFormInput from '../HtmlHelpers/FormInput';
import HtmlFormSelect from '../HtmlHelpers/FormSelect';
import HtmlButton from '../HtmlHelpers/Button';
import { RemoveValidationClasses, ValidateFormByClass } from '@/app/api/utils/js-helpers';
import { ClipLoader } from 'react-spinners';

export default function EditarInventario({ open, onClose, onReload, productoId, userId }) {
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
    Estado: 'Activo',
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [onLoadingBtn, setOnLoadingBtn] = useState(false);

  useEffect(() => {
    if (open && productoId) {
      fetchProducto();
      fetchCategorias();
      fetchProveedores();
    }
  }, [open, productoId]);


  const fetchProducto = async () => {
    try {
      console.log(`Buscando producto con ID: ${productoId}`);
      const response = await fetch(`/api/inventario/${productoId}`);
      if (!response.ok) {
        toast.error(`Producto con ID ${productoId} no encontrado.`);
        return;
      }

      const result = await response.json();
      console.log("Respuesta de la API:", result);

      if (result.status !== 'success' || !result.data) {
        toast.warning("No se encontraron datos para el producto seleccionado.");
        return;
      }

      const { data } = result;

      console.log("Datos del producto obtenidos:", data);

      setFormData({
        Nombre: data.Nombre || '',
        Descripcion: data.Descripcion || '',
        PrecioCompra: data.PrecioCompra || '',
        PrecioVenta: data.PrecioVenta || '',
        Stock: data.Stock || '',
        CategoriaID: data.CategoriaID || '',
        ProveedorID: data.ProveedorID || '',
        FechaIngreso: data.FechaIngreso?.split('T')[0] || '',
        FechaCaducidad: data.FechaCaducidad?.split('T')[0] || '',
        Estado: data.Estado || 'Activo',
      });
    } catch (error) {
      console.error('Error al cargar los datos del producto:', error);
      toast.error('Error al cargar los datos del producto');
    }
  };


  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (!response.ok) throw new Error('Error al obtener las categorías');
      const { data } = await response.json();
      setCategorias(data || []);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await fetch('/api/proveedor');
      if (!response.ok) throw new Error('Error al obtener los proveedores');
      const { data } = await response.json();
      setProveedores(data || []);
    } catch (error) {
      toast.error('Error al cargar los proveedores');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setFormData({
      Nombre: '',
      Descripcion: '',
      PrecioCompra: '',
      PrecioVenta: '',
      Stock: '',
      CategoriaID: '',
      ProveedorID: '',
      FechaIngreso: '',
      FechaCaducidad: '',
      Estado: 'Activo',
    });
    RemoveValidationClasses('fc-inv-edit');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = ValidateFormByClass('fc-inv-edit');
    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }
    actualizarProducto();
  };

  const actualizarProducto = async () => {
    setOnLoadingBtn(true);
    try {
      const response = await fetch(`/api/inventario/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          PrecioCompra: parseFloat(formData.PrecioCompra),
          PrecioVenta: parseFloat(formData.PrecioVenta),
          Stock: parseInt(formData.Stock),
          CategoriaID: parseInt(formData.CategoriaID),
          ProveedorID: parseInt(formData.ProveedorID),
          IdUsuarioModificacion: userId, // Incluye el usuario que modifica
          FechaModificacion: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success(data.message);
        if (onReload) onReload();
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al actualizar el producto');
    } finally {
      setOnLoadingBtn(false);
    }
  };

  const arrayCategorias = categorias.map((c) => ({
    value: c.CategoriaProductoID,
    label: c.NombreCategoria,
  }));

  const arrayProveedores = proveedores.map((p) => ({
    value: p.ProveedorID,
    label: p.Nombre,
  }));

  const modalChild = (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex-grow w-full max-h-[49vh] overflow-y-auto">
        <HtmlFormInput legend="Nombre" type="text" value={formData.Nombre} additionalClass="fc-inv-edit" onChange={handleChange} name="Nombre" />
        <HtmlFormInput legend="Descripción" type="text" value={formData.Descripcion} additionalClass="fc-inv-edit" onChange={handleChange} name="Descripcion" />
        <HtmlFormSelect legend="Categoría" options={arrayCategorias} value={formData.CategoriaID} additionalClass="fc-inv-edit" onChange={handleChange} name="CategoriaID" />
        <HtmlFormSelect legend="Proveedor" options={arrayProveedores} value={formData.ProveedorID} additionalClass="fc-inv-edit" onChange={handleChange} name="ProveedorID" />
        <HtmlFormInput legend="Precio Compra" type="number" value={formData.PrecioCompra} additionalClass="fc-inv-edit" onChange={handleChange} name="PrecioCompra" />
        <HtmlFormInput legend="Precio Venta" type="number" value={formData.PrecioVenta} additionalClass="fc-inv-edit" onChange={handleChange} name="PrecioVenta" />
        <HtmlFormInput legend="Stock" type="number" value={formData.Stock} additionalClass="fc-inv-edit" onChange={handleChange} name="Stock" />
        <HtmlFormInput legend="Fecha Ingreso" type="date" value={formData.FechaIngreso} additionalClass="fc-inv-edit" onChange={handleChange} name="FechaIngreso" />
        <HtmlFormInput legend="Fecha Caducidad" type="date" value={formData.FechaCaducidad} additionalClass="fc-inv-edit" onChange={handleChange} name="FechaCaducidad" />
      </div>
      {onLoadingBtn ? (
        <div className="flex items-center justify-center mt-20">
          <ClipLoader size={30} speedMultiplier={1.5} />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 mt-4">
          <HtmlButton type="submit" colSize={1} color="blue" icon={Pencil} legend="Actualizar" />
          <HtmlButton onClick={handleClose} colSize={1} color="red" icon={X} legend="Cancelar" />
        </div>
      )}
    </form>
  );

  return (
    <ModalTemplate title="Editar Producto" icon={Pencil} open={open} onClose={handleClose} children={modalChild} />
  );
}
