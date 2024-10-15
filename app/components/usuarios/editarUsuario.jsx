import { Plus, X } from "lucide-react";
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import { RemoveClassesAndAdd, RemoveValidationClasses, ValidateEmailStructure, ValidateFormByClass, ValidatePassword, ValidatePasswordMatch } from "@/app/api/utils/js-helpers";
import HtmlCheckButton from "../HtmlHelpers/CheckButton";
import { useSession } from "next-auth/react";
import HtmlButton from "../HtmlHelpers/Button";
import { ClipLoader } from "react-spinners";

export default function EditarUsuario({ open, onClose, onGet_ListaUsuarios, listaRoles, idUsuario }) {
  const [onLoading, onSet_Loading] = useState(false);
  const [onLoadingGet, onSet_onLoading] = useState(false);

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

  

  // Actualizar usuario
  const onUpdateUsuario = (e) => {
    e.preventDefault();

    const isValid = ValidateFormByClass("fc-usuario-edit");

    if (!isValid) {
      toast.warning('Aún existen campos por completar');
      return;
    }

    if (!ValidateEmailStructure(formData.correo)) {
      validaEstructuraCorreo();
      return;
    }

    // Marcar como válidos
    RemoveClassesAndAdd("txtCorreo", "is-valid");
    RemoveClassesAndAdd("txtClave", "is-valid");
    RemoveClassesAndAdd("txtClaveConfirmacion", "is-valid");

    // Si todo es correcto
    actualizarUsuario();

  };

  // Validaciones auxiliares
  const validaEstructuraCorreo = () => {
    RemoveClassesAndAdd("txtCorreo", "is-warning");
    toast.warning('El correo electrónico no cumple con la estructura correcta. Intente de nuevo');
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

    RemoveValidationClasses("fc-usuario-edit");
    onClose()
  };

  const actualizarUsuario = async () => {

    onSet_Loading(true);

    let model = {
      idUsuario: idUsuario,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      telefono: formData.telefono,
      idRol: Number(formData.idRol),
      usuario: formData.usuario,
      esEmpleado: formData.esEmpleado,
      direccion: formData.direccion,
      idUsuarioModificacion: Number(session?.user.id)
    }

    console.log("Model usuario: " + JSON.stringify(model))

    try {
      const response = await fetch('/api/usuarios', {
        method: 'PUT',
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
      console.error('Error al actualizar el usuario:', error);
      toast.error("Error al actualizar el usuario: " + error);
    }
    finally {
      onSet_Loading(false);
    }


  }

  //Obtener el usuario por el id
  const onGetUsuarioById = useCallback(async () => {
    onSet_onLoading(true);
    try {

      if (idUsuario == 0) {
        toast.error('No fue proporcionado un Id para buscar el usuario');
        limpiarForm();
      }
      else {
        const response = await fetch(`/api/usuarios/${idUsuario}`);
        const result = await response.json();
        if (result.status === "success") {
          toast.success('Se ha obtenido el usuario');
          setFormData({
            nombre: result.data.nombre,
            apellidos: result.data.apellidos,
            correo: result.data.correo,
            telefono: result.data.telefono,
            idRol: result.data.idRol,
            usuario: result.data.usuario,
            direccion: result.data.direccion,
            esEmpleado: result.data.esEmpleado
          });


        }
        else if (result.code === 204) {
          console.log(result.message);
          toast.error('Error al obtener el usuario: ' + result.message);
          onSet_onLoading(false);
        }
        else {
          console.log(result.message);
          toast.error('Error al obtener el usuario: ' + result.message);
        }
      }

    }
    catch (error) {
      console.error('Error al obtener el usuario:', error);
      toast.error('Sucedió un error al obtener el rol: ' + error);
    }
    finally {
      onSet_onLoading(false);
    }
  }, [idUsuario]);


  useEffect(() => {
    if (open) {
      onGetUsuarioById();
    }
  }, [open, onGetUsuarioById]);


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
            Editar Usuario #{idUsuario}
          </h2>
          <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2" />
          {onLoadingGet ? (
            <div className="flex items-center justify-center m-1">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <>
              <form method="PUT" className="my-6 w-full" onSubmit={onUpdateUsuario}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
                  <HtmlFormInput legend="Nombre" type="text" colSize={1} id="txtNombre" additionalClass="fc-usuario-edit" value={formData.nombre} onChange={handleChange} name="nombre" />
                  <HtmlFormInput legend="Apellidos" type="text" colSize={1} id="txtApellidos" additionalClass="fc-usuario-edit" value={formData.apellidos} onChange={handleChange} name="apellidos" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
                  <HtmlFormInput legend="Correo" type="text" colSize={1} id="txtCorreo" additionalClass="fc-usuario-edit" value={formData.correo} onChange={handleChange} name="correo" />
                  <HtmlFormInput legend="Teléfono" type="text" colSize={1} id="txtTelefono" additionalClass="fc-usuario-edit" value={formData.telefono} onChange={handleChange} name="telefono" />
                  <HtmlFormSelect legend="Rol" options={listaRoles} selectedValue={formData.idRol} onChange={handleChange} name="idRol" additionalClass="fc-usuario-edit" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
                  <HtmlFormInput legend="Usuario" type="text" colSize={1} id="txtUsuario" additionalClass="fc-usuario-edit" value={formData.usuario} onChange={handleChange} name="usuario" />
                  <HtmlCheckButton legend="Es Empleado" onChange={(e) => setFormData((prev) => ({ ...prev, esEmpleado: e.target.checked }))} checked={formData.esEmpleado} />

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
                      <HtmlButton type="submit" legend={"Actualizar"} color={"blue"} icon={Plus} />
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
