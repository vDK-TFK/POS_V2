import { Pencil, Plus, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { RemoveClassesAndAddByName, RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import HtmlCheckButton from "../HtmlHelpers/CheckButton";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";

export default function EditarProductoVenta({ open, onClose, reloadProducts, productoVenta,categorias }) {
  const [imagePreviewEdit, setImagePreviewEdit] = useState(null);
  const [imageTypeEdit, setimageTypeEdit] = useState(null);
  const [onLoading, onSet_Loading] = useState(false);

  
  // Sesion
  const { data: session } = useSession();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    idProductoVenta_e:0,
    nombre_e: "",
    categoria_e: "",
    cantDisponible_e: "",
    cantMinima_e: "",
    precio_e: "",
    imagen_e: null,
    tipoImagen_e: null,
    noRebajaInventario_e: false,
    actualizaImagen_e:false
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Valida cantidades positivas
    if ((name === "cantMinima_e" || name === "cantDisponible_e" || name === "precio_e") && value <= 0) {
      RemoveClassesAndAddByName(name, "is-invalid");
      toast.warning("No puede colocar valores negativos o en cero");
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    } else {
      RemoveClassesAndAddByName(name, "is-valid");
    }

    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updImage = () => {
    if (!formData.actualizaImagen_e) {
      setImagePreviewEdit(null);
      setimageTypeEdit(null)
    }
    else {
      setImagePreviewEdit(productoVenta.imagen);
      setimageTypeEdit(productoVenta.tipoImagen)
    }

  }

  useEffect(() => {
    if (productoVenta) {
      RemoveValidationClasses("fc-product-e")
      setFormData({
        idProductoVenta_e: productoVenta.productoVentaId,
        nombre_e:productoVenta.nombre,
        categoria_e: productoVenta.idCategoriaProdVenta,
        cantDisponible_e: productoVenta.cantDisponible,
        cantMinima_e:productoVenta.cantMinima,
        precio_e:productoVenta.precio,
        imagen_e:productoVenta.imagen,
        tipoImagen_e:productoVenta.tipoImagen,
        noRebajaInventario_e:productoVenta.noRebajaInventario
      });
      setImagePreviewEdit(productoVenta.imagen);
      setimageTypeEdit(productoVenta.tipoImagen)
    }
  }, [productoVenta]);


  const handleClose = () => {
    setFormData({
      idProductoVenta_e:0,
      nombre_e: "",
      categoria_e: "",
      cantDisponible_e: 0,
      cantMinima_e: 0,
      precio_e: 0,
      imagen_e: null,
      tipoImagen_e: null,
      noRebajaInventario_e: false,
      actualizaImagen_e:false
    });
    setImagePreviewEdit(null);
    setimageTypeEdit(null)
    onClose()

    RemoveValidationClasses("fc-product-e-edit");
  };

  const handleImageUpload = (e) => {
    const fileEdit = e.target.files[0];

    if (fileEdit && (fileEdit.type === 'image/jpeg' || fileEdit.type === 'image/png')) {
      const readerEdit = new FileReader();

      readerEdit.onloadend = () => {
        toast.success("Imagen cargada exitosamente");
        setImagePreviewEdit(readerEdit.result);
        setimageTypeEdit(fileEdit.type);
      };

      readerEdit.readAsDataURL(fileEdit);
    } 
    else {
      toast.error("El formato debe ser PNG o JPG");
      console.error('El archivo seleccionado no es una imagen JPG o PNG.');
      setImagePreviewEdit(null);
      setimageTypeEdit(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValidForm = ValidateFormByClass("fc-product-e");

    if(!isValidForm){
      toast.warning("Aún existen campos por completar");
    }
    
    else if (isValidForm && (Number(formData.cantMinima_e) >= Number(formData.cantDisponible_e)) && !formData.noRebajaInventario_e) {
      RemoveClassesAndAddByName("cantMinima_e", "is-invalid");
      toast.warning('Cantidad mínima debe ser menor a la cantidad disponible');
    }
    else{
      editarProdVenta()
    }

    

  }

  async function editarProdVenta() {
    var bytesImage_e = null;
    var typeImage_e = null;

    if ((imagePreviewEdit && imageTypeEdit) && formData.actualizaImagen_e) {
      if (imageTypeEdit === 'image/png') {
        bytesImage_e = imagePreviewEdit.replace(/^data:image\/png;base64,/, '');
      } else if (imageTypeEdit === 'image/jpeg') {
        bytesImage_e = imagePreviewEdit.replace(/^data:image\/jpeg;base64,/, '');
      }
      typeImage_e = imageTypeEdit;
    }

    let model = {
      idProductoVenta:formData.idProductoVenta_e,
      nombre: formData.nombre_e,
      cantidad: Number(formData.cantDisponible_e),
      cantidadMinima: Number(formData.cantMinima_e),
      precio: Number(formData.precio_e),
      idUsuarioModificacion: Number(session?.user.id),
      idCategoriaProdVenta: Number(formData.categoria_e),
      noRebajaInventario: formData.noRebajaInventario_e,
      imagen: formData.actualizaImagen_e ? bytesImage_e : null,
      tipoImagen: formData.actualizaImagen_e ? typeImage_e : null
    };

    onSet_Loading(true);

    try {
      const response = await fetch('/api/productosventa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const data = await response.json();

      if (data.status == "success") {
        toast.success(data.message);
        handleClose();
        if (reloadProducts) {
          reloadProducts();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Sucedió un error al editar el producto", error);
      console.error("Sucedió un error al editar el producto", error);
    } finally {
      onSet_Loading(false);
    }
  }


  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} m-auto max-w-3xl w-full md:w-2/3 lg:w-7/12`}>
        <button className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={20} strokeWidth={2} onClick={handleClose} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <Pencil /> Editar Producto # {formData.idProductoVenta_e}
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>
          <form method="PUT" onSubmit={handleSubmit} className="my-2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend={"Nombre"} type={"text"} colSize={1} value={formData.nombre_e} name={"nombre_e"} additionalClass={"fc-product-e"} onChange={handleChange} />
              <HtmlFormSelect colSize={1} legend={"Categoría"} selectedValue={formData.categoria_e} name={"categoria_e"} options={categorias} additionalClass={"fc-product-e"} onChange={handleChange} />
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput legend={"Cant. Disponible"} type={"number"} colSize={1} value={formData.cantDisponible_e} name={"cantDisponible_e"} additionalClass={"fc-product-e"} onChange={handleChange} />
              <HtmlFormInput legend={"Cant. Mínima"} type={"number"} colSize={1} value={formData.cantMinima_e} name={"cantMinima_e"} additionalClass={"fc-product-e"} onChange={handleChange} />
              <HtmlFormInput legend={"Precio"} type={"number"} colSize={1} value={formData.precio_e} name={"precio_e"} additionalClass={"fc-product-e"} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <div className="col-span-1 m-2">
                <HtmlCheckButton legend="No rebaja inventario" checked={formData.noRebajaInventario_e} onChange={(e) => setFormData((prev) => ({ ...prev, noRebajaInventario_e: e.target.checked }))} />
              </div>
              <div className="col-span-1 m-2">
                <HtmlCheckButton legend="Actualizar Imagen" checked={formData.actualizaImagen_e} onChange={(e) => setFormData((prev) => ({ ...prev, actualizaImagen_e: e.target.checked }), updImage())} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              {
                formData.actualizaImagen_e && (
                  <HtmlFormInput legend={"Imagen"} type={"file"} colSize={1} onChange={(e) => { handleImageUpload(e), handleChange(e) }} />
                )
              }
              {imagePreviewEdit && (
                <div className="flex flex-col items-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Vista Previa:</h3>
                  <Image src={imagePreviewEdit} alt="Preview" className="max-w-xs max-h-20 mx-auto" height={100} width={80} />
                </div>
              )}
            </div>

            <div className="flex justify-center mt-4">
              {onLoading ? (
                <div className="flex items-center justify-center m-1">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <>
                  <HtmlButton type="submit" legend={"Actualizar"} color={"blue"} icon={Pencil} />
                  <HtmlButton type="button" legend={"Cancelar"} color={"gray"} icon={XCircle} onClick={handleClose} />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
