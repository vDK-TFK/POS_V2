import { Pencil, Plus, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import { ClipLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import HtmlButton from "../HtmlHelpers/Button";

export default function EditarCliente({ open, onClose, idCliente, onGet_ListaClientes }) {
  //Variables
  const [onLoading, onSet_Loading] = useState(false);
  const [onLoadingGet, onSet_onLoading] = useState(false);


  //Sesion
  const { data: session } = useSession();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    celular: "",
    direccion: ""
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "telefono" || name === "celular") && !/^[\d-]*$/.test(value)) {      
      toast.info('Solo se permiten números y separaciones por guión (-)');
      return; 
    }


    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      telefono: "",
      celular: "",
      direccion: ""
    });

    RemoveValidationClasses("fc-cliente-edit");
    onClose()
  };

  // Guardar usuario
  const onUpdate_Cliente = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-cliente-edit");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }
    editarCliente();



  };

  const editarCliente = async () => {

    onSet_Loading(true);

    let model = {
      idCliente:Number(idCliente),
      nombre: formData.nombre,
      celular: formData.celular,
      telefono: formData.telefono,
      direccion: formData.direccion,
      idUsuarioModificacion: Number(session?.user.id)
    }

    try {
      const response = await fetch('/api/clientes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const data = await response.json();

      if (data.status == "success") {
        toast.success(data.message)
        onGet_ListaClientes();
        handleClose();
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      console.error('Error al editar el cliente:', error);
      toast.error("Error al editar el cliente: " + error);
    }
    finally {
      onSet_Loading(false);
    }


  }

  //Obtener el usuario por el id
  const onGetClienteById = useCallback(async () => {
    onSet_onLoading(true);
    try {

      if (idCliente == 0) {
        toast.error('No fue proporcionado un Id para buscar el cliente');
        limpiarForm();
      }
      else {
        const response = await fetch(`/api/clientes/${idCliente}`);
        const result = await response.json();
        if (result.status === "success") {
          toast.success('Se ha obtenido el cliente');
          setFormData({
            nombre:result.data.nombreCompleto,
            telefono:result.data.telefono,
            celular:result.data.celular,
            direccion:result.data.direccion,
          });


        }
        else if (result.code === 204) {
          console.log(result.message);
          toast.error(result.message);
          onSet_onLoading(false);
        }
        else {
          console.log(result.message);
          toast.error(result.message);
        }
      }

    }
    catch (error) {
      console.error('Error al obtener el cliente:', error);
      toast.error('Sucedió un error al obtener el cliente: ' + error);
    }
    finally {
      onSet_onLoading(false);
    }
  }, [idCliente]);


  useEffect(() => {
    if (open) {
      onGetClienteById();
    }
  }, [open, onGetClienteById]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} m-auto max-w-3xl w-full md:w-2/3 lg:w-7/12`}>
        {onLoading ? (
          <div className="flex items-center justify-center m-1">
            <ClipLoader size={10} speedMultiplier={1.5} />
          </div>
        ) : (
          <>
            <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <X size={20} strokeWidth={2} />
            </button>
          </>
        )}


        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
            Editar Cliente #{idCliente}
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>
          {onLoadingGet ? (
            <div className="flex items-center justify-center m-1">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <>
          <form method="PUT" className="my-6 w-full" onSubmit={onUpdate_Cliente}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <HtmlFormInput legend={"Nombre"} value={formData.nombre} type={"text"} colSize={1} onChange={handleChange} name={"nombre"} additionalClass={"fc-cliente-edit"} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend={"Teléfono"} value={formData.telefono} type={"text"} colSize={1} additionalClass={"fc-cliente-edit"} name={"telefono"} onChange={handleChange} maxLength={15} />
              <HtmlFormInput legend={"Celular"} value={formData.celular} type={"text"} colSize={1} name={"celular"} onChange={handleChange} maxLength={15} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <HtmlTextArea legend={"Dirección"} value={formData.direccion} colSize={1} name={"direccion"} onChange={handleChange} />
            </div>
            <div className="flex justify-center gap-6 mt-5">
              {onLoading ? (
                <div className="flex items-center justify-center m-1">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <>
                  <HtmlButton type="submit" legend={"Editar"} color={"blue"} icon={Pencil} />
                  <HtmlButton type="button" legend={"Cancelar"} color={"gray"} icon={X} onClick={handleClose} />
                </>
              )}
            </div>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
