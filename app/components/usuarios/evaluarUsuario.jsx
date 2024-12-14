import { Plus, Smile, X } from "lucide-react";
import { toast } from 'sonner';
import { useState } from 'react';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import { RemoveValidationClasses, ValidateFormByClass, } from "@/app/api/utils/js-helpers";
import { useSession } from "next-auth/react";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function EvaluarUsuario({ open, onClose, onGet_ListaUsuarios,idUsuario }) {
  const [onLoading, onSet_Loading] = useState(false);

  //Sesion
  const { data: session } = useSession();

  // Estado del formulario
  const [formData, setFormData] = useState({
    asunto:"",
    observaciones:""
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Guardar evaluación
  const onSave_Evaluacion = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-metas");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }
    
    // Si todo es correcto
    guardarMetas();

  };

  
  const handleClose = () => {
    setFormData({
      asunto:"",
        observaciones:""
    });

    RemoveValidationClasses("fc-usuario");
    onClose()
  };

  const guardarMetas = async () => {

    onSet_Loading(true);

    let model = {
        idEmpleado:Number(idUsuario),
        asunto:formData.asunto,
        observaciones:formData.observaciones,
        idUsuarioCreacion:Number(session?.user.id)
    }
    
    try {
      const response = await fetch('/api/usuarios/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const data = await response.json();

      if (data.status == "success") {
        toast.success(data.message)
        onGet_ListaUsuarios();
        handleClose();
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      console.error('Error al evaluar el usuario:', error);
      toast.error("Error al evaluar el usuario: " + error);
    }
    finally {
      onSet_Loading(false);
    }


  }

  const modalChild = (
    <form method="POST" className="my-6 w-full" onSubmit={onSave_Evaluacion}>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
        <HtmlFormInput legend="Asunto" type="text" colSize={1} additionalClass="fc-metas" value={formData.asunto} onChange={handleChange} name="asunto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
        <HtmlTextArea legend="Observaciones" type="text" colSize={1} additionalClass="fc-metas" value={formData.observaciones} onChange={handleChange} name="observaciones" />
      </div>

      <div className="flex justify-center mt-2">
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

  );


  return (
    <ModalTemplate open={open} onClose={onClose} children={modalChild} icon={Smile} title={"Evaluar Empleado"} />
  );
}
