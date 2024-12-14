import { useState, useEffect } from 'react';
import { Plus, X } from "lucide-react";
import { toast } from 'sonner';
import ModalTemplate from '../HtmlHelpers/ModalTemplate';
import HtmlFormInput from '../HtmlHelpers/FormInput';
import HtmlFormSelect from '../HtmlHelpers/FormSelect';
import HtmlButton from '../HtmlHelpers/Button';
import { ValidateFormByClass, RemoveValidationClasses } from '@/app/api/utils/js-helpers';
import { ClipLoader } from 'react-spinners';

export default function CrearProducto({ open, onClose, onReload, userId }) { // Agregar userId
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
    Estado: 'Activo', // Estado por defecto
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [onLoadingBtn, setOnLoadingBtn] = useState(false);
  const classResponsiveDivs = "xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2";

  useEffect(() => {
    if (open) {
      fetchCategorias();
      fetchProveedores();
    }
  }, [open]);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (!response.ok) throw new Error('Error al obtener las categorías');
      const data = await response.json();
      setCategorias(data.data || []);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await fetch('/api/proveedor');
      if (!response.ok) throw new Error('Error al obtener los proveedores');
      const data = await response.json();
      setProveedores(data.data || []);
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
    RemoveValidationClasses('fc-prod-create');
    onClose();
  };

  const handleAgregar = async (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass('fc-prod-create');
    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }

    setOnLoadingBtn(true);
    try {
      const response = await fetch(`/api/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          PrecioCompra: parseFloat(formData.PrecioCompra),
          PrecioVenta: parseFloat(formData.PrecioVenta),
          Stock: parseInt(formData.Stock),
          CategoriaID: parseInt(formData.CategoriaID),
          ProveedorID: parseInt(formData.ProveedorID),
          IdUsuarioCreacion: userId, // Incluye el usuario que creó el producto
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
      toast.error('Error al registrar el producto');
    } finally {
      setOnLoadingBtn(false);
    }
  };

  const arrayProveedores = proveedores.map((p) => ({
    value: p.ProveedorID,
    label: p.Nombre,
  }));

  const arrayCategorias = categorias.map((c) => ({
    value: c.CategoriaProductoID,
    label: c.NombreCategoria,
  }));

  const modalChildren = (
    <form onSubmit={handleAgregar} className="w-full">
      <div className={`grid grid-cols-1 gap-4 mx-auto`}>
        <HtmlFormInput legend="Nombre" value={formData.Nombre} type="text" additionalClass="fc-prod-create" onChange={handleChange} name="Nombre" />
      </div>
      <div className={`grid grid-cols-1 gap-4 mx-auto`}>
        <HtmlFormInput legend="Descripción" value={formData.Descripcion} type="text" additionalClass="fc-prod-create" onChange={handleChange} name="Descripcion" />
      </div>
      <div className={`grid grid-cols-1 gap-4 mx-auto`}>
        <HtmlFormSelect
          options={arrayProveedores}
          legend="Proveedor"
          value={formData.ProveedorID}
          additionalClass="fc-prod-create"
          onChange={handleChange}
          name="ProveedorID"
        />
      </div>
      <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
        <HtmlFormInput legend="Precio Compra" value={formData.PrecioCompra} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="PrecioCompra" />
        <HtmlFormInput legend="Precio Venta" value={formData.PrecioVenta} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="PrecioVenta" />
      </div>
      <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
        <HtmlFormInput legend="Stock" value={formData.Stock} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="Stock" />
        <HtmlFormSelect
          legend="Categoría"
          options={arrayCategorias}
          value={formData.CategoriaID}
          additionalClass="fc-inv-create"
          onChange={handleChange}
          name="CategoriaID"
        />
      </div>
      <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
        <HtmlFormInput legend="Fecha Ingreso" value={formData.FechaIngreso} type="date" additionalClass="fc-prod-create" onChange={handleChange} name="FechaIngreso" />
        <HtmlFormInput legend="Fecha Caducidad" value={formData.FechaCaducidad} type="date" additionalClass="fc-prod-create" onChange={handleChange} name="FechaCaducidad" />
      </div>
      {onLoadingBtn ? (
        <div className="flex items-center justify-center mt-20">
          <ClipLoader size={30} speedMultiplier={1.5} />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 mt-4">
          <HtmlButton type="submit" colSize={1} color="green" icon={Plus} legend="Agregar" />
          <HtmlButton onClick={handleClose} colSize={1} color="red" icon={X} legend="Cancelar" />
        </div>
      )}
    </form>
  );

  return (
    <ModalTemplate open={open} onClose={handleClose} icon={Plus} title="Agregar Producto">
      <form onSubmit={handleAgregar} className="w-full">
        <div className={`grid grid-cols-1 gap-4 mx-auto`}>
          <HtmlFormInput legend="Nombre" value={formData.Nombre} type="text" additionalClass="fc-prod-create" onChange={handleChange} name="Nombre" />
        </div>
        <div className={`grid grid-cols-1 gap-4 mx-auto`}>
          <HtmlFormInput legend="Descripción" value={formData.Descripcion} type="text" additionalClass="fc-prod-create" onChange={handleChange} name="Descripcion" />
        </div>
        <div className={`grid grid-cols-1 gap-4 mx-auto`}>
          <HtmlFormSelect
            options={arrayProveedores}
            legend="Proveedor"
            value={formData.ProveedorID}
            additionalClass="fc-prod-create"
            onChange={handleChange}
            name="ProveedorID"
          />
        </div>
        <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
          <HtmlFormInput legend="Precio Compra" value={formData.PrecioCompra} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="PrecioCompra" />
          <HtmlFormInput legend="Precio Venta" value={formData.PrecioVenta} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="PrecioVenta" />
        </div>
        <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
          <HtmlFormInput legend="Stock" value={formData.Stock} type="number" additionalClass="fc-prod-create" onChange={handleChange} name="Stock" />
          <HtmlFormSelect
            legend="Categoría"
            options={arrayCategorias}
            value={formData.CategoriaID}
            additionalClass="fc-inv-create"
            onChange={handleChange}
            name="CategoriaID"
          />
        </div>
        <div className={`grid ${classResponsiveDivs} gap-4 mx-auto`}>
          <HtmlFormInput legend="Fecha Ingreso" value={formData.FechaIngreso} type="date" additionalClass="fc-prod-create" onChange={handleChange} name="FechaIngreso" />
          <HtmlFormInput legend="Fecha Caducidad" value={formData.FechaCaducidad} type="date" additionalClass="fc-prod-create" onChange={handleChange} name="FechaCaducidad" />
        </div>
        {onLoadingBtn ? (
          <div className="flex items-center justify-center mt-20">
            <ClipLoader size={30} speedMultiplier={1.5} />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 mt-4">
            <HtmlButton type="submit" colSize={1} color="green" icon={Plus} legend="Agregar" />
            <HtmlButton onClick={handleClose} colSize={1} color="red" icon={X} legend="Cancelar" />
          </div>
        )}
      </form>
    </ModalTemplate>
  );
}
