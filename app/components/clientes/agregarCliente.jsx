import { Plus, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import HtmlButton from "../HtmlHelpers/Button";

export default function AgregarCliente({ open, onClose, onGet_ListaClientes }) {
  //Variables
  const [onLoading, onSet_Loading] = useState(false);


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

    RemoveValidationClasses("fc-cliente");
    onClose()
  };

  // Guardar cliente
  const onSave_Cliente = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-cliente");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }
    guardarCliente();



  };

  const guardarCliente = async () => {

    onSet_Loading(true);

    let model = {
      nombre: formData.nombre,
      celular: formData.celular,
      telefono: formData.telefono,
      direccion: formData.direccion,
      idUsuarioCreacion: Number(session?.user.id)
    }

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const data = await response.json();

      if (data.status == "success") {
        toast.success(data.message)
        if(onGet_ListaClientes){
          onGet_ListaClientes();
        }

        handleClose();
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      console.error('Error al crear el cliente:', error);
      toast.error("Error al registrar el cliente: " + error);
    }
    finally {
      onSet_Loading(false);
    }


  }

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
            Agregar Nuevo Cliente
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>
          <form method="POST" className="my-6 w-full" onSubmit={onSave_Cliente}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <HtmlFormInput legend={"Nombre"} value={formData.nombre} type={"text"} colSize={1} onChange={handleChange} name={"nombre"} additionalClass={"fc-cliente"} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend={"Teléfono"} value={formData.telefono} type={"text"} colSize={1} additionalClass={"fc-cliente"} name={"telefono"} onChange={handleChange} maxLength={15} />
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
                  <HtmlButton type="submit" legend={"Registrar"} color={"green"} icon={Plus} />
                  <HtmlButton type="button" legend={"Cancelar"} color={"gray"} icon={X} onClick={handleClose} />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
