import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import Image from "next/image";

export default function EditarProductoVenta({ open, onClose, reloadProducts, productoVenta }) {
  const [catalogoEditarCategorias, setCatalogoEditarCategorias] = useState([]);
  const [imagePreviewEdit, setImagePreviewEdit] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [formDataEditar, setFormDataEditar] = useState({
    productoVentaId: '',
    nombre: '',
    idCategoriaProdVenta: '',
    cantDisponible: '',
    cantMinima: '',
    precio: '',
    imagen: ''
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (productoVenta) {
      setFormDataEditar({
        productoVentaId: productoVenta.productoVentaId,
        nombre: productoVenta.nombre,
        idCategoriaProdVenta: productoVenta.idCategoriaProdVenta,
        cantDisponible: productoVenta.cantDisponible,
        cantMinima: productoVenta.cantMinima,
        precio: productoVenta.precio,
        imagen: productoVenta.imagen
      });
      setImagePreviewEdit(productoVenta.imagen);
    }
  }, [productoVenta]);

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const handleChangeEditar = (e) => {
    const { id, value } = e.target;
    setFormDataEditar((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const limpiarCamposFormEditar = () => {
    setFormDataEditar({
      productoVentaId: '',
      nombre: '',
      idCategoriaProdVenta: '',
      cantDisponible: '',
      cantMinima: '',
      precio: '',
      imagen: ''
    });
    setImagePreviewEdit(null);
    setIsCheckboxChecked(false);

    const elementsEdit = formRef.current.getElementsByClassName("fc-product-edit");
    Array.from(elementsEdit).forEach((element) => {
      element.value = "";
      element.classList.remove('is-invalid');
      element.classList.remove('is-valid');
    });
  };

  useEffect(() => {
    const obtenerCategoriasProductoVentaEdit = async () => {
      try {
        const response = await fetch(`/api/categoriasprodventa`);
        if (!response.ok) {
          throw new Error(`Error al obtener las categorías: ${response.statusText}`);
        }
        const dataCat = await response.json();
        if (dataCat.length === 0) {
          console.log("No hay categorías de productos");
        } else {
          const catalogoEditar = dataCat.map(item => ({
            value: item.idCategoriaProdVenta,
            label: item.nombre
          }));
          setCatalogoEditarCategorias(catalogoEditar);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    obtenerCategoriasProductoVentaEdit();
  }, []);

  const handleImageUploadEdit = (e) => {
    const fileEdit = e.target.files[0];

    if (fileEdit && (fileEdit.type === 'image/jpeg' || fileEdit.type === 'image/png')) {
      const readerEdit = new FileReader();

      readerEdit.onloadend = () => {
        toast.success("Imagen cargada exitosamente");
        setImagePreviewEdit(readerEdit.result);
        setImageType(fileEdit.type);
      };

      readerEdit.readAsDataURL(fileEdit);
    } else {
      toast.error("El formato debe ser PNG o JPG");
      console.error('El archivo seleccionado no es una imagen JPG o PNG.');
      setImagePreviewEdit(null);
    }
  };

  const onFormSubmitEditar = (e) => {
    e.preventDefault();
    handleSubmitEditar(true);
  };

  const handleSubmitEditar = async (isFromButton) => {
    let isValid = true;

    const elementsForm = formRef.current.getElementsByClassName("fc-product-edit");
    Array.from(elementsForm).forEach((item) => {
      item.classList.remove('is-invalid');
      item.classList.remove('is-valid');

      if (item.value.trim() === "") {
        item.classList.add('is-invalid');
        isValid = false;
      } else {
        item.classList.add('is-valid');
      }
    });

    const cantMinima = formDataEditar.cantMinima;
    const cantDisponible = formDataEditar.cantDisponible;

    if (!isValid && isFromButton) {
      toast.warning('Aún existen campos por completar');
    } else if (isValid && Number(cantMinima) >= Number(cantDisponible)) {
      toast.warning('Cantidad mínima debe ser menor a la cantidad disponible');
    } else {
      await editarProductoVenta();
    }
  };

  const editarProductoVenta = async () => {
    let bytesImage = null;
    let typeImage = null;
    let actualizaImagen = false;

    if (imagePreviewEdit && imageType) {
      if (imageType === 'image/png') {
        bytesImage = imagePreviewEdit.replace(/^data:image\/png;base64,/, '');
      } else if (imageType === 'image/jpeg') {
        bytesImage = imagePreviewEdit.replace(/^data:image\/jpeg;base64,/, '');
      }
      typeImage = imageType;
      actualizaImagen = true;
    }

    const model = {
      idProductoVenta: formDataEditar.productoVentaId,
      nombre: formDataEditar.nombre,
      cantidad: Number(formDataEditar.cantDisponible),
      cantidadMinima: Number(formDataEditar.cantMinima),
      precio: Number(formDataEditar.precio),
      idCategoriaproductoVenta: Number(formDataEditar.idCategoriaProdVenta),
      imagen: bytesImage,
      tipoImagen: typeImage,
      actualizaImagen: actualizaImagen
    };

    try {
      const response = await fetch('/api/productosventa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      if (response.ok) {
        onClose();
        toast.success('Producto actualizado satisfactoriamente');
        setTimeout(() => {
          reloadProducts();
          limpiarCamposFormEditar();
        }, 3000);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toast.error("Sucedió un error al actualizar el producto", error);
      console.error(error);
    }
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} m-auto max-w-3xl w-full md:w-2/3 lg:w-7/12`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={20} strokeWidth={2} onClick={limpiarCamposFormEditar} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
            Editar Producto
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>
          <form ref={formRef} method="PUT" className="my-6 w-full" onSubmit={onFormSubmitEditar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend={"Nombre"} type={"text"} colSize={1} id={"nombre"} onChange={handleChangeEditar} value={formDataEditar.nombre} additionalClass={"fc-product-edit"} />
              <HtmlFormSelect colSize={1} legend={"Categoría"} id={"idCategoriaProdVenta"} onChange={handleChangeEditar} selectedValue={formDataEditar.idCategoriaProdVenta} options={catalogoEditarCategorias} additionalClass={"fc-product-edit"} />
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput legend={"Cant. Disponible"} type={"number"} colSize={1} id={"cantDisponible"} onChange={handleChangeEditar} value={formDataEditar.cantDisponible} additionalClass={"fc-product-edit"} />
              <HtmlFormInput legend={"Cant. Mínima"} type={"number"} colSize={1} id={"cantMinima"} onChange={handleChangeEditar} value={formDataEditar.cantMinima} additionalClass={"fc-product-edit"} />
              <HtmlFormInput legend={"Precio"} type={"text"} colSize={1} id={"precio"} onChange={handleChangeEditar} value={formDataEditar.precio} additionalClass={"fc-product-edit"} />

            </div>

            <div className="grid mt-2 grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <div className={`col-span-1`}>
                <input id="chkActualizaImagen" checked={isCheckboxChecked} onChange={handleCheckboxChange} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="chkActualizaImagen" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Actualizar Imagen</label>
              </div>
              {isCheckboxChecked && (
                <HtmlFormInput
                  legend={"Imagen"}
                  type={"file"}
                  colSize={1}
                  id={"txtImagenProducto-edit"}
                  additionalClass={""}
                  onChange={handleImageUploadEdit}
                />
              )}

              {imagePreviewEdit && (
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Vista Previa de la Imagen:</h3>
                  <Image src={imagePreviewEdit} height={200} width={200} alt="Preview" className="max-w-xs max-h-20 mx-auto" />
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6 mt-5">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-8">
                Guardar
              </button>
              <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-8" onClick={onClose} onClickCapture={limpiarCamposFormEditar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
