import { Pencil, Plus, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import { ClipLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import HtmlButton from "../HtmlHelpers/Button";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function EditarCliente({ open, onClose, idCliente, onGet_ListaClientes }) {
  //Variables
  const [onLoadingBtn, onSet_Loading] = useState(false);
  const [onLoadingGet, onSet_onLoading] = useState(true);
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

    RemoveValidationClasses("fc-cliente-edit-edit");
    onClose()
  };

  // Guardar usuario
  const onUpdate_Cliente = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-cliente-edit-edit");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }
    editarCliente();



  };

  const editarCliente = async () => {

    onSet_Loading(true);

    let model = {
      idCliente: Number(idCliente),
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
            nombre: result.data.nombreCompleto,
            telefono: result.data.telefono,
            celular: result.data.celular,
            direccion: result.data.direccion,
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

  const modalChild = (
    <form onSubmit={onUpdate_Cliente} className="w-full">
      {onLoadingGet ? (
        <div className="flex items-center justify-center mt-20">
          <ClipLoader size={30} speedMultiplier={1.5} />
        </div>
      ) : (
        <div className="flex-grow w-full max-h-[49vh] overflow-y-auto">
          <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
            <HtmlFormInput legend="Nombre" value={formData.nombre} type="text" colSize={1} onChange={handleChange} name="nombre" additionalClass="fc-cliente-edit" />
          </div>
          <div className={`pl-4 grid ${classResponsiveDivs2} gap-4 mx-auto w-full`}>
            <HtmlFormInput legend="Teléfono" value={formData.telefono} type="text" colSize={1} additionalClass="fc-cliente-edit" name="telefono" onChange={handleChange} maxLength={15} />
            <HtmlFormInput legend="Celular" value={formData.celular} type="text" colSize={1} name="celular" onChange={handleChange} maxLength={15} />
          </div>
          <div className={`pl-4 grid ${classResponsiveDivs} gap-4 mx-auto w-full`}>
            <HtmlTextArea legend="Dirección" value={formData.direccion} colSize={1} name="direccion" onChange={handleChange} />
          </div>
        </div>
      )}
      <div className="w-full p-2 border-t border-gray-300">
        {onLoadingBtn ? (
          <div className="flex items-center justify-center mt-20">
            <ClipLoader size={30} speedMultiplier={1.5} />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 mt-4">
            <HtmlButton type="submit" legend="Editar" color="blue" icon={Plus} />
            <HtmlButton type="button" legend="Cancelar" color="red" icon={X} onClick={handleClose} />
          </div>
        )}
      </div>
    </form>
  );



  return (
    <ModalTemplate children={modalChild} onClose={onClose} icon={Pencil} open={open} title={"Editar Cliente #" + idCliente} />
  )


}
