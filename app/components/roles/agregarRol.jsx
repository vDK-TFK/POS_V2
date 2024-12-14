import { Check, CircleAlert, Plus, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import { RemoveClassById, SetClassById, SetRemoveClassById } from "@/app/api/utils/js-helpers";
import HtmlCheckButton from "../HtmlHelpers/CheckButton";
import { useSession } from "next-auth/react";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";
import { ClipLoader } from "react-spinners";

export default function AgregarRol({ open, onClose, listaPermisos,onGet_ListaRoles }) {
   const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
   const [nombreRol, setNombreRol] = useState("");
   const [descripcionRol, setDescripcionRol] = useState("");
   const [loading,onSetLoading] = useState(false);

   //Sesion
  const { data: session } = useSession();

   const limpiarForm = () => {
      setNombreRol("");
      setDescripcionRol("");
      setPermisosSeleccionados([]);
      RemoveClassById("txtNombreRol", ["is-invalid", "is-valid"])
   };

   const handleClose = () => {
      limpiarForm();
      if (onClose) {
         onClose();
      }
   };

   const togglePermiso = (idPermiso) => {
      setPermisosSeleccionados((prev) => {
         if (prev.includes(idPermiso)) {
            // Si el permiso está seleccionado, lo desmarcamos
            const nuevoSeleccionados = prev.filter(id => id !== idPermiso);
   
            // Función para desmarcar recursivamente los hijos de un permiso
            const desmarcarHijos = (id) => {
               const hijos = listaPermisos.filter(p => p.idPermisoPadre === id);
               hijos.forEach((hijo) => {
                  if (nuevoSeleccionados.includes(hijo.idPermiso)) {
                     nuevoSeleccionados.splice(nuevoSeleccionados.indexOf(hijo.idPermiso), 1);
                     desmarcarHijos(hijo.idPermiso); // Llamada recursiva para los hijos del hijo
                  }
               });
            };
   
            desmarcarHijos(idPermiso);
   
            return nuevoSeleccionados;
         } else {
            // Si el permiso no está seleccionado, lo marcamos
            const nuevoSeleccionados = [...prev, idPermiso];
            const permisoSeleccionado = listaPermisos.find(p => p.idPermiso === idPermiso);
   
            const agregarPadres = (id) => {
               const permiso = listaPermisos.find(p => p.idPermiso === id);
               if (permiso && permiso.idPermisoPadre) {
                  const idPadre = permiso.idPermisoPadre;
                  if (!nuevoSeleccionados.includes(idPadre)) {
                     nuevoSeleccionados.push(idPadre);
                     agregarPadres(idPadre);
                  }
               }
            };
   
            agregarPadres(idPermiso);
   
            return nuevoSeleccionados;
         }
      });
   };
   

   const handleGuardar = async () => {
      if (onValidate()) {
         let model = {
            nombre: nombreRol,
            descripcion: descripcionRol == "" ? '--Sin descripción--' : descripcionRol,
            permisos: permisosSeleccionados,
            idUsuarioCreacion: Number(session?.user.id)
         };
         onSetLoading(true);

         try {
            const response = await fetch('/api/roles', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(model)
            });

            const data = await response.json();

            if (data.status == "success") {
               toast.success(data.message)
               onGet_ListaRoles();
               handleClose();
               onSetLoading(false);

            }
            else {
               toast.error("Error al crear el rol: " + data.message)
            }
         } catch (error) {
            console.error('Error al crear el rol:', error);
            toast.error("Error al crear el rol: " + error)
         }
      }
   };

   const onValidate = () => {
      let esValido = true;

      if (nombreRol == "") {
         SetRemoveClassById("txtNombreRol", "is-invalid", "is-valid")
         toast.warning("Debe ingresar el nombre del rol")
         esValido = false
      }
      else{
         SetRemoveClassById("txtNombreRol", "is-valid", "is-invalid")
      }

      if (permisosSeleccionados.length == 0) {
         toast.warning("Debe seleccionar al menos un permiso")
         esValido = false
      }

      return esValido;
   }

   const renderPermisos = (permiso, nivel) => {
      const hijos = listaPermisos.filter(p => p.idPermisoPadre === permiso.idPermiso);
      const estaSeleccionado = permisosSeleccionados.includes(permiso.idPermiso);

      return (
         <div key={permiso.idPermiso} className={`mb-2`} style={{ marginLeft: `${nivel * 4}px` }}>
            <div className="flex items-center space-x-3">
               <HtmlCheckButton
                  legend={permiso.nombre}
                  checked={estaSeleccionado} // Verifica si el permiso está seleccionado
                  onChange={() => togglePermiso(permiso.idPermiso)}
               />
            </div>
            {hijos.length > 0 && (
               <div className="mt-2 pl-2">
                  {hijos.map(hijo => renderPermisos(hijo, nivel + 1))}
               </div>
            )}
            {nivel === 0 && <hr className="my-3 border-gray-300 dark:border-gray-600" />}
         </div>
      );
   };


   const modalChild = (
      <>
         <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-4 border rounded-lg h-96 overflow-y-auto">
               {listaPermisos.filter(p => !p.idPermisoPadre).map((permisoPadre) => (
                  renderPermisos(permisoPadre, 0)
               ))}
            </div>

            <div className="p-4 flex flex-col space-y-4">
               <HtmlFormInput legend={"Nombre del Rol"} type={"text"} id={"txtNombreRol"} className="w-full" value={nombreRol} onChange={(e) => setNombreRol(e.target.value)} />
               <HtmlFormInput legend={"Descripción (Opcional)"} id={"txtDescripcion"} className="w-full" value={descripcionRol} onChange={(e) => setDescripcionRol(e.target.value)} />

               {loading ? (
                  <div className="flex items-center justify-center mt-20">
                     <ClipLoader size={30} speedMultiplier={1.5} />
                  </div>
               ):(
                     <div className="flex justify-end">
                        <HtmlButton
                           legend="Guardar"
                           color={"green"}
                           icon={Plus}
                           onClick={handleGuardar}
                        />
                     </div>
               )}
               
            </div>
         </div>
      </>
      
   );

   return (
      <ModalTemplate open={open} icon={Plus} onClose={onClose} title={"Agregar Rol"}>
         <>
            <div className="grid grid-cols-2 gap-4 w-full">
               <div className="p-4 border rounded-lg h-96 overflow-y-auto">
                  {listaPermisos.filter(p => !p.idPermisoPadre).map((permisoPadre) => (
                     renderPermisos(permisoPadre, 0)
                  ))}
               </div>

               <div className="p-4 flex flex-col space-y-4">
                  <HtmlFormInput legend={"Nombre del Rol"} type={"text"} id={"txtNombreRol"} className="w-full" value={nombreRol} onChange={(e) => setNombreRol(e.target.value)} />
                  <HtmlFormInput legend={"Descripción (Opcional)"} id={"txtDescripcion"} className="w-full" value={descripcionRol} onChange={(e) => setDescripcionRol(e.target.value)} />

                  {loading ? (
                     <div className="flex items-center justify-center mt-20">
                        <ClipLoader size={30} speedMultiplier={1.5} />
                     </div>
                  ) : (
                     <div className="flex justify-end">
                        <HtmlButton
                           legend="Guardar"
                           color={"green"}
                           icon={Plus}
                           onClick={handleGuardar}
                        />
                     </div>
                  )}

               </div>
            </div>
         </>
      </ModalTemplate>
   );
}
