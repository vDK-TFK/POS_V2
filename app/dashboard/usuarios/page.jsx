'use client'

import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import { AlarmClock, AtSign, Ban, BanIcon, Check, Cog, Edit3,  Pencil, PhoneCall, SmilePlus,  UnlockKeyhole, User, UserPlus, X,  } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from 'sonner';
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import AgregarHorario from "@/app/components/usuarios/agregarHorario";
import EditarHorario from "@/app/components/usuarios/editarHorario";
import { ClipLoader } from "react-spinners";
import AgregarUsuario from "@/app/components/usuarios/agregarUsuario";
import EditarUsuario from "@/app/components/usuarios/editarUsuario";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import ModalBloquearDesbloquear from "@/app/components/utilities/bloquear";
import EvaluarUsuario from "@/app/components/usuarios/evaluarUsuario";
import PageContent from "@/app/components/HtmlHelpers/PageContent";
import TablePagination from "@/app/components/HtmlHelpers/Pagination";

const itemsBreadCrumb = ["Dashboard", "Usuarios"];

export default function Usuarios() {
    // #region [Constantes]
    const [listaUsuarios, onSet_ListaUsuarios] = useState([]);
    const [listaRoles, onSet_ListaRoles] = useState([]);
    const [onLoading, onSet_onLoading] = useState(false);
    const [paginaActual, onSet_PaginaActual] = useState(1);
    const fetchCalled = useRef(false);
    const [agregarHorario, onModal_AgregarHorario] = useState(false);
    const [editarHorario, onModal_EditarHorario] = useState(false);
    const [agregarUsuario, onModal_AgregarUsuario] = useState(false);
    const [editarUsuario, onModal_EditarUsuario] = useState(false);
    const [bloquearDesbloquear, onModal_BloquearDesbloquear] = useState(false);
    const [evaluar, onModal_Evaluar] = useState(false);
    const [esBloquear, onSet_EsBloquear] = useState(false);
    const [idUsuario, onSet_IdUsuario] = useState(null);
    // #endregion

    // #region [Paginación]
    const [registrosPorPagina] = useState(5); // Cantidad de registros por página
    const indexOfLastRole = paginaActual * registrosPorPagina;
    const indexOfFirstRole = indexOfLastRole - registrosPorPagina;
    const currentUsuarios = listaUsuarios.slice(indexOfFirstRole, indexOfLastRole);
    const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);
    // #endregion

    // #region [Funciones]
    //Obtener lista de Usuarios
    const onGet_ListaUsuarios = useCallback(async () => {
        onSet_onLoading(true);
        try {
            const response = await fetch(`/api/usuarios`);
            const result = await response.json();
            if (result.status === "success") {
                onSet_ListaUsuarios(result.data)
                toast.success('Se han obtenido los registros');
            }
            else if (result.code === 204) {
                toast.warning('No se encontraron registros');
                onSet_ListaUsuarios([])
            }
            else {
                console.log(result.message);
                toast.error('Error al obtener los registros');
                onSet_ListaUsuarios([])
            }
        }
        catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
            toast.error('Sucedió un error al obtener la lista de usuarios');
            onSet_ListaUsuarios([])
        }
        finally {
            onSet_onLoading(false);
        }
    }, []);

    //Obtener lista de Roles para el select
    const onGetListaRoles = useCallback(async () => {
        try {
            const response = await fetch(`/api/roles`);
            const result = await response.json();

            if (result.status === "success") {
                const listaRolesSimplificada = result.data.listaRoles.map(rol => ({
                    value: rol.idRol,
                    label: rol.nombre
                }));
                onSet_ListaRoles(listaRolesSimplificada);
            }
            else {
                console.error('Error al obtener la lista de roles:', result.message);
                toast.error('Error al obtener la lista de roles: ' + result.message);
                onSet_ListaRoles([]);
            }
        }
        catch (error) {
            console.error('Error al obtener la lista de roles:', error);
            toast.error('Sucedió un error al obtener la lista de roles');
            onSet_ListaRoles([]);
        }
    }, []);

    useEffect(() => {
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            onGet_ListaUsuarios();
            onGetListaRoles()
        }
    }, [onGet_ListaUsuarios, onGetListaRoles]);
    // #endregion
    
    const pageContent = (
        <>
        {onLoading ? (
            <div className="flex items-center justify-center mt-20" >
                <ClipLoader size={30} speedMultiplier={1.5} />
            </div >
        ) : (
            <div className="pt-4">
                <HtmlButton color="blue" icon={UserPlus} legend="Nuevo Usuario" onClick={() => onModal_AgregarUsuario(true)} />
                <div className="shadow-xl border-2 bg-white dark:bg-gray-700 px-1 py-1 rounded-xl mt-4">
                    <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ overflow: 'auto', maxHeight: '30rem' }}>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-white uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 text-center" style={{ width: '8%' }}>No.</th>
                                    <th className="px-6 py-3" style={{ width: '17%' }}>Nombre Completo</th>
                                    <th className="px-6 py-3" style={{ width: '7%' }}>Usuario / Rol</th>
                                    <th className="px-6 py-3" style={{ width: '10%' }}>Contacto</th>
                                    <th className="px-6 py-3" style={{ width: '5%' }}>Estado</th>
                                    <th className="px-6 py-3" style={{ width: '20%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsuarios.map((item, index) =>
                                    item && (
                                        <tr key={index} className="bg-white dark:bg-gray-800">
                                            <td className="px-6 py-4 text-gray-900"># {item.idUsuario}</td>
                                            <td className="px-6 py-4 text-gray-900">{item.nombre} {item.apellidos}</td>
                                            <td className="px-6 py-4 text-gray-900">
                                                <HtmlNewLabel color="indigo" icon={User} legend={item.usuario} />
                                                <HtmlNewLabel color="gray" icon={Cog} legend={item.Rol.nombre} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                <HtmlNewLabel color="blue" icon={AtSign} legend={item.correo} />
                                                <HtmlNewLabel color="violet" icon={PhoneCall} legend={item.telefono} />
                                            </td>
                                            
                                            <td className="px-6 py-4 text-gray-900">
                                                {item.bloqueado ? (
                                                    <HtmlNewLabel color="red" icon={Ban} legend="Bloqueado" />
                                                ) : (
                                                    <HtmlNewLabel color="green" icon={Check} legend="Activo" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 flex gap-2">
                                                {item.esEmpleado && !item.bloqueado && (
                                                    <>
                                                        <HtmlTableButton color={"green"} onClick={() => { onSet_IdUsuario(item.idUsuario); (item.horarios.length === 0 ? onModal_AgregarHorario(true) : onModal_EditarHorario(true)); }} tooltip={item.horarios.length != 0 ? 'Editar Horario' : 'Asignar Horario'} hasCornerBadge={item.horarios.length == 0 ? false : true} iconCorner={Pencil} icon={AlarmClock} />
                                                        <HtmlTableButton color="yellow" tooltip="Evaluar empleado" icon={SmilePlus} onClick={() => { onSet_IdUsuario(item.idUsuario); onModal_Evaluar(true); }} />
                                                    </>
                                                )}
                                                {item.bloqueado ? (
                                                    <HtmlTableButton color="lime" tooltip="Activar / Desbloquear" icon={UnlockKeyhole} onClick={() => { onSet_IdUsuario(item.idUsuario); onSet_EsBloquear(false); onModal_BloquearDesbloquear(true); }} />
                                                ) : (
                                                    <>
                                                        <HtmlTableButton color="blue" tooltip="Editar Usuario" icon={Edit3} onClick={() => { onSet_IdUsuario(item.idUsuario); onModal_EditarUsuario(true); }} />
                                                        <HtmlTableButton color="red" tooltip="Inactivar / Bloquear" icon={BanIcon} onClick={() => { onSet_IdUsuario(item.idUsuario); onSet_EsBloquear(true); onModal_BloquearDesbloquear(true); }} />
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Paginación */}
                <TablePagination onSet_PaginaActual={onSet_PaginaActual} paginaActual={paginaActual} listado={listaUsuarios} />
            </div>
            
        )}
            <AgregarHorario open={agregarHorario} onClose={() => onModal_AgregarHorario(false)} idUsuario={idUsuario} onGet_ListaUsuarios={() => onGet_ListaUsuarios()} />
            <EditarHorario open={editarHorario} onClose={() => onModal_EditarHorario(false)} idUsuario={idUsuario} onGet_ListaUsuarios={() => onGet_ListaUsuarios()} />
            <AgregarUsuario open={agregarUsuario} onClose={() => onModal_AgregarUsuario(false)} onGet_ListaUsuarios={() => onGet_ListaUsuarios()} listaRoles={listaRoles} />
            <EditarUsuario open={editarUsuario} onClose={() => onModal_EditarUsuario(false)} onGet_ListaUsuarios={() => onGet_ListaUsuarios()} listaRoles={listaRoles} idUsuario={idUsuario} />
            <ModalBloquearDesbloquear open={bloquearDesbloquear} onClose={() => onModal_BloquearDesbloquear(false)} isBlock={esBloquear} idType={idUsuario} onReload={onGet_ListaUsuarios} entity={"usuarios"} />
            <EvaluarUsuario open={evaluar} onClose={() => onModal_Evaluar(false)} onGet_ListaUsuarios={() => onGet_ListaUsuarios()} idUsuario={idUsuario} />
        </>


    );

    return(
        <PageContent content={pageContent} itemsBreadCrumb={itemsBreadCrumb} tituloCard="Administración de Usuarios" />
    );

}
