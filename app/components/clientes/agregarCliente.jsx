import { Plus, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import HtmlButton from "../HtmlHelpers/Button";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function AgregarCliente({ open, onClose, onGet_ListaClientes }) {
  //Variables
  const [onLoading, onSet_Loading] = useState(false);
  const classResponsiveDivs = "sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1";
  const classResponsiveDivs2 = "sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2";



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
        if (onGet_ListaClientes) {
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

  const modalChild = (
    <form onSubmit={onSave_Cliente} className="w-full">
      <div className="flex-grow w-full max-h-[49vh] overflow-y-auto">
        <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
          <HtmlFormInput legend={"Nombre"} value={formData.nombre} type={"text"} colSize={1} onChange={handleChange} name={"nombre"} additionalClass={"fc-cliente"} />
        </div>

        <div className={`pl-4 grid ${classResponsiveDivs2} gap-4 mx-auto w-full`}>
          <HtmlFormInput legend={"Teléfono"} value={formData.telefono} type={"text"} colSize={1} additionalClass={"fc-cliente"} name={"telefono"} onChange={handleChange} maxLength={15} />
          <HtmlFormInput legend={"Celular"} value={formData.celular} type={"text"} colSize={1} name={"celular"} onChange={handleChange} maxLength={15} />
        </div>

        <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
          <HtmlTextArea legend={"Dirección"} value={formData.direccion} colSize={1} name={"direccion"} onChange={handleChange} />
        </div>
      </div>
      <div className="w-full p-2 border-t border-gray-300">
        {
          onLoading ? (
            <div className="flex items-center justify-center mt-20">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4 mt-4">
              <HtmlButton type="submit" legend={"Registrar"} color={"green"} icon={Plus} />
              <HtmlButton type="button" legend={"Cancelar"} color={"red"} icon={X} onClick={handleClose} />
            </div>
          )
        }
      </div>

    </form>
  );

  return (
    <ModalTemplate onClose={onClose} icon={Plus} open={open} title={"Agregar Cliente"}>
      <form onSubmit={onSave_Cliente} className="w-full">
        <div className="flex-grow w-full max-h-[49vh] overflow-y-auto">
          <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
            <HtmlFormInput legend={"Nombre"} value={formData.nombre} type={"text"} colSize={1} onChange={handleChange} name={"nombre"} additionalClass={"fc-cliente"} />
          </div>

          <div className={`pl-4 grid ${classResponsiveDivs2} gap-4 mx-auto w-full`}>
            <HtmlFormInput legend={"Teléfono"} value={formData.telefono} type={"text"} colSize={1} additionalClass={"fc-cliente"} name={"telefono"} onChange={handleChange} maxLength={15} />
            <HtmlFormInput legend={"Celular"} value={formData.celular} type={"text"} colSize={1} name={"celular"} onChange={handleChange} maxLength={15} />
          </div>

          <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
            <HtmlTextArea legend={"Dirección"} value={formData.direccion} colSize={1} name={"direccion"} onChange={handleChange} />
          </div>
        </div>
        <div className="w-full p-2 border-t border-gray-300">
          {
            onLoading ? (
              <div className="flex items-center justify-center mt-20">
                <ClipLoader size={30} speedMultiplier={1.5} />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 mt-4">
                <HtmlButton type="submit" legend={"Registrar"} color={"green"} icon={Plus} />
                <HtmlButton type="button" legend={"Cancelar"} color={"red"} icon={X} onClick={handleClose} />
              </div>
            )
          }
        </div>

      </form>
    </ModalTemplate>
  );
}
