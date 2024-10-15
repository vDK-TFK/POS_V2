import { Plus, X } from "lucide-react";
import { toast } from 'sonner';
import { useState } from 'react';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import { RemoveClassesAndAdd, RemoveValidationClasses, ValidateEmailStructure, ValidateFormByClass, ValidatePassword, ValidatePasswordMatch } from "@/app/api/utils/js-helpers";
import HtmlCheckButton from "../HtmlHelpers/CheckButton";
import { useSession } from "next-auth/react";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";

export default function AgregarUsuario({ open, onClose, onGet_ListaUsuarios,listaRoles }) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const [onLoading, onSet_Loading] = useState(false);

  //Sesion
  const { data: session } = useSession();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    idRol: "",
    usuario: "",
    clave: "",
    confirmarClave: "",
    direccion: "",
    esEmpleado: false
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mostrar/ocultar contraseña
  const toggleMostrarClave = () => {
    setMostrarClave((prev) => !prev);
  };

  // Guardar usuario
  const onSaveUsuario = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-usuario");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }

    if (!ValidateEmailStructure(formData.correo)) {
      validaEstructuraCorreo();
      return;
    }

    if (!ValidatePasswordMatch(formData.clave, formData.confirmarClave)) {
      validaClaveCoincide();
      return;
    }

    const mensajes = ValidatePassword(formData.clave);
    if (mensajes.length) {
      validaClave(mensajes);
      return;
    }

    // Marcar como válidos
    RemoveClassesAndAdd("txtCorreo", "is-valid");
    RemoveClassesAndAdd("txtClave", "is-valid");
    RemoveClassesAndAdd("txtClaveConfirmacion", "is-valid");

    // Si todo es correcto
    guardarUsuario();

  };

  // Validaciones auxiliares
  const validaEstructuraCorreo = () => {
    RemoveClassesAndAdd("txtCorreo", "is-warning");
    toast.warning('El correo electrónico no cumple con la estructura correcta. Intente de nuevo');
  };

  const validaClaveCoincide = () => {
    RemoveClassesAndAdd("txtClave", "is-warning");
    RemoveClassesAndAdd("txtClaveConfirmacion", "is-warning");
    toast.warning('Las contraseñas no coinciden. Intente de nuevo');
  };

  const validaClave = (mensajes) => {
    RemoveClassesAndAdd("txtClave", "is-warning");
    RemoveClassesAndAdd("txtClaveConfirmacion", "is-warning");

    const msjFormat = mensajes.map((mensaje) => `- ${mensaje}`).join("<br />");
    toast.info(<span dangerouslySetInnerHTML={{ __html: msjFormat }} />);
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      rol: "",
      usuario: "",
      clave: "",
      confirmarClave: "",
      direccion: "",
      esEmpleado: false
    });

    RemoveValidationClasses("fc-usuario");
    setMostrarClave(false);
    onClose()
  };

  const guardarUsuario = async () => {

    onSet_Loading(true);

    let model = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      telefono: formData.telefono,
      idRol: Number(formData.idRol),
      usuario: formData.usuario,
      clave: formData.clave,
      esEmpleado: formData.esEmpleado,
      direccion: formData.direccion,
      idUsuarioCreacion: Number(session?.user.id)
    }
    
    try {
      const response = await fetch('/api/usuarios', {
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
        toast.error("Error al crear el usuario: " + data.message)
      }
    }
    catch (error) {
      console.error('Error al crear el usuario:', error);
      toast.error("Error al crear el usuario: " + error);
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
            Agregar Nuevo Usuario
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2" />
          <form method="POST" className="my-6 w-full" onSubmit={onSaveUsuario}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
              <HtmlFormInput legend="Nombre" type="text" colSize={1} id="txtNombre" additionalClass="fc-usuario" value={formData.nombre} onChange={handleChange} name="nombre" />
              <HtmlFormInput legend="Apellidos" type="text" colSize={1} id="txtApellidos" additionalClass="fc-usuario" value={formData.apellidos} onChange={handleChange} name="apellidos" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput legend="Correo" type="text" colSize={1} id="txtCorreo" additionalClass="fc-usuario" value={formData.correo} onChange={handleChange} name="correo" />
              <HtmlFormInput legend="Teléfono" type="text" colSize={1} id="txtTelefono" additionalClass="fc-usuario" value={formData.telefono} onChange={handleChange} name="telefono" />
              <HtmlFormSelect legend="Rol" options={listaRoles} value={formData.idRol} onChange={handleChange} name="idRol" additionalClass="fc-usuario" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput legend="Usuario" type="text" colSize={1} id="txtUsuario" additionalClass="fc-usuario" value={formData.usuario} onChange={handleChange} name="usuario" />
              <HtmlFormInput legend="Contraseña" type={mostrarClave ? "text" : "password"} colSize={1} id="txtClave" additionalClass="fc-usuario" value={formData.clave} onChange={handleChange} name="clave" />
              <HtmlFormInput legend="Confirmar Contraseña" type={mostrarClave ? "text" : "password"} colSize={1} id="txtClaveConfirmacion" additionalClass="fc-usuario" value={formData.confirmarClave} onChange={handleChange} name="confirmarClave" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <div className="col-span-1 m-2">
                <HtmlCheckButton legend="Es Empleado" onChange={(e) => setFormData((prev) => ({ ...prev, esEmpleado: e.target.checked }))} />
              </div>
              <div className="col-span-1 m-2">
                <HtmlCheckButton legend={`${mostrarClave ? "Ocultar " : "Mostrar "} claves`} onChange={toggleMostrarClave} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              <HtmlFormInput legend="Dirección" type="text" colSize={1} id="txtDireccion" additionalClass="" value={formData.direccion} onChange={handleChange} name="direccion" />
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
