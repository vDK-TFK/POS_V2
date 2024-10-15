import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import Image from "next/image";


export default function AgregarProductoVenta({ open, onClose, reloadProducts, infoEmpresa }) {
  const [catalogoCategoria, setCatalogoCategorias] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState(null);
  var isValid = true;

  const limpiarCamposForm = () => {
    const elements = document.getElementsByClassName("fc-product");
    Array.from(elements).forEach((element) => {
      element.value = "";
      element.classList.remove('is-invalid');
      element.classList.remove('is-valid');
    });
    setImagePreview(null);
    const fileInput = document.getElementById("txtImagenProducto");
    if (fileInput) {
      fileInput.value = "";
    }
    setImagePreview(null);
    setImageType(null);

  };

  useEffect(() => {
    const obtenerCategoriasProdVenta = async () => {
      try {
        const response = await fetch(`/api/categoriasprodventa`);
        if (!response.ok) {
          throw new Error(`Error al obtener las categorías: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          console.log("No hay categorías de productos");
        } else {
          console.log(data);
          const opcionesCategoria = data.map(item => ({
            value: item.idCategoriaProdVenta,
            label: item.nombre
          }));
          setCatalogoCategorias(opcionesCategoria);
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    obtenerCategoriasProdVenta();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        toast.success("Imagen cargada exitosamente")
        setImagePreview(reader.result);
        setImageType(file.type);
      };

      reader.readAsDataURL(file);
    }
    else {
      toast.error("El formato debe ser PNG O JPG")
      console.error('El archivo seleccionado no es una imagen JPG o PNG.');
      setImagePreview(null);
    }
  };

  const onFormSubmit = (e) => {
    handleSubmit(e, true);
  };

  const handleSubmit = (e, isFromButton) => {
    e.preventDefault();
    isValid = true;
    const elements = document.getElementsByClassName("fc-product");

    Array.from(elements).forEach((item) => {
      if (item.value.trim() == "") {
        item.classList.add('is-invalid');
        item.classList.remove('is-valid');
        isValid = false;
      }
      else {
        item.classList.add('is-valid');
        item.classList.remove('is-invalid');
      }
    });

    let cantMinima = getItemValue("txtCantMinima");
    let cantDisponible = getItemValue("txtCantDisponible")

    if (!isValid && isFromButton) {
      toast.warning('Aún existen campos por completar');
    }
    else if (isValid && Number(cantMinima) >= Number(cantDisponible)) {
      document.getElementById("txtCantMinima").classList.remove('is-valid');
      document.getElementById("txtCantMinima").classList.add('is-invalid');
      toast.warning('Cantidad mínima debe ser menor a la cantidad disponible');
    }
    else {
      if (isFromButton) {
        agregarProdVenta()
      }
    }

  };

  async function agregarProdVenta() {
    var bytesImage;
    var typeImage;
    console.log(infoEmpresa)
    if (imagePreview && imageType) {
      if (imageType === 'image/png') {
        bytesImage = imagePreview.replace(/^data:image\/png;base64,/, '');
      } else if (imageType === 'image/jpeg') {
        bytesImage = imagePreview.replace(/^data:image\/jpeg;base64,/, '');
      }
      typeImage = imageType;
    }

    if (imagePreview == null) {
      const bufferImagen = Buffer.from(infoEmpresa.logo.data);
      bytesImage = bufferImagen.toString('base64');
      typeImage = infoEmpresa.tipoImagen;
    }

    let model = {
      nombre: getItemValue("txtNombreProducto"),
      cantidad: Number(getItemValue("txtCantDisponible")),
      cantidadMinima: Number(getItemValue("txtCantMinima")),
      precio: Number(getItemValue("txtPrecioProducto")),
      idCategoriaProdVenta: Number(getItemValue("txtSelectCategoria")),
      imagen: bytesImage,
      tipoImagen: typeImage
    }

    try {
      const response = await fetch('/api/productosventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      if (response.ok) {
        const data = await response.json();
        onClose();
        toast.success('Producto registrado satisfactoriamente');
        limpiarCamposForm();

        setTimeout(() => {
          reloadProducts();
        }, 1000);
      }
      else {
        throw new Error(`Error: ${response.statusText}`);
      }
    }
    catch (error) {
      toast.error("Sucedió un error al agregar el producto", error);
      console.error(error);
    }

  }

  const getItemValue = (id) => {
    return document.getElementById(id).value;
  }

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
    >
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} m-auto max-w-3xl w-full md:w-2/3 lg:w-7/12`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={20} strokeWidth={2} onClick={limpiarCamposForm} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
            Agregar Nuevo Producto
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>
          <form method="POST" className="my-6 w-full" onSubmit={onFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend={"Nombre"} type={"text"} colSize={1} id={"txtNombreProducto"} additionalClass={"fc-product"} />
              <HtmlFormSelect colSize={1} legend={"Categoría"} id={"txtSelectCategoria"} options={catalogoCategoria} additionalClass={"fc-product"} />
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput legend={"Cant. Disponible"} type={"number"} colSize={1} id={"txtCantDisponible"} additionalClass={"fc-product"} />
              <HtmlFormInput legend={"Cant. Mínima"} type={"number"} colSize={1} id={"txtCantMinima"} additionalClass={"fc-product"} />
              <HtmlFormInput legend={"Precio"} type={"number"} colSize={1} id={"txtPrecioProducto"} additionalClass={"fc-product"} />

            </div>

            <div className="grid mt-2 grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <HtmlFormInput legend={"Imagen"} type={"file"} colSize={1} id={"txtImagenProducto"} additionalClass={""} onChange={handleImageUpload} />
              {imagePreview && (
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Vista Previa de la Imagen:</h3>

                  <Image src={imagePreview} alt="Preview" className="max-w-xs max-h-20 mx-auto" height={200} width={200} />
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6 mt-5">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-8">
                Guardar
              </button>
              <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-8" onClick={onClose} onClickCapture={limpiarCamposForm} >
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
