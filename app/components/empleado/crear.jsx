import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CalendarClock } from "lucide-react";

export default function Agregar({ open, onClose, mutate }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [listaRoles, onSet_ListaRoles] = useState([]);
    const fetchCalled = useRef(false);

    //Obtener lista de Roles
    const onGet_ListaRoles = useCallback(async () => {
        try {
            const response = await fetch(`/api/roles`);
            const result = await response.json();
            if (result.status === "success") {
                const listaRolesSimplificada = result.data.listaRoles.map(rol => ({
                    idRol: rol.idRol,
                    nombre: rol.nombre
                }));
                
                listaRolesSimplificada.unshift({
                    idRol: "",
                    nombre: "--Seleccione--"
                });
            
                onSet_ListaRoles(listaRolesSimplificada);
            }
            else if (result.code === 204) {
                toast.warning('No se encontraron registros');
                onSet_ListaRoles([]);
            }
            else {
                console.log(result.message);
                toast.error('Error al obtener los movimientos');
                onSet_ListaRoles([]);
            }
        }
        catch (error) {
            console.error('Error al obtener la lista de cajas:', error);
            toast.error('Sucedió un error al obtener la lista de cajas');
            onSet_ListaRoles([]);
        }
        finally {
        }
    }, []);

    const handleAgregar = handleSubmit(async (data) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    roleId: parseInt(data.roleId)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const newEmployee = await res.json();
                toast.success('Nuevo usuario guardado con éxito');
                mutate(currentData => [...currentData, newEmployee], false);
                setTimeout(() => {
                    onClose();
                    reset();
                }, 500);
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            toast.error('Error en la solicitud');
        }
    });

    const handleCancel = () => {
        onClose();
        reset();
    };

    useEffect(() => {
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            onGet_ListaRoles();
        }
    }, [onGet_ListaRoles]);

    return (
        <div onClick={handleCancel} className={`fixed inset-0 justify-center items-center grid grid-cols-8 transition-opacity ${open ? "visible bg-black bg-opacity-20" : "invisible"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-xl shadow p-6 transition-all col-span-4 col-start-3 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                <button onClick={handleCancel} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">
                    <X />
                </button>
                <div className="w-full">
                    <div className="mx-5 my-4 w-full">
                        <h2 className="text-2xl font-bold flex gap-3 text-center text-gray-900">Registrar empleado</h2>
                        <hr className="my-3 mr-7 py-0.2 border border-black"></hr>
                    </div>
                    <form onSubmit={handleAgregar} className="ml-5 my-4 w-full">
                        <div className="grid mr-5 gap-x-12 grid-cols-2">
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">Usuario</label>
                                <input type="text" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("username", { required: { value: true, message: 'El username es requerido' } })} />
                                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <input type="email" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("email", { required: { value: true, message: 'El email es requerido' } })} />
                                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                                <input type="password" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("password", { required: { value: true, message: 'La contraseña es requerida' } })} />
                                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("nombre", { required: { value: true, message: 'El nombre es requerido' } })} />
                                {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellidos</label>
                                <input type="text" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("apellido", { required: { value: true, message: 'El apellido es requerido' } })} />
                                {errors.apellido && <span className="text-red-500">{errors.apellido.message}</span>}
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Telefono</label>
                                <input type="text" maxLength="8" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("telefono", { required: { value: true, message: 'El telefono es requerido' } })} />
                                {errors.telefono && <span className="text-red-500">{errors.telefono.message}</span>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">Rol</label>
                                <select required id="roleId" name="roleId" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("roleId", { required: { value: true, message: 'El rol es requerido' } })}>
                                    {listaRoles.map((rol) => (
                                        <option key={rol.idRol} value={rol.idRol}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                                {/* {errors.roleId && <span className="text-red-500">{errors.roleId.message}</span>} */}
                            </div>
                            <div className="mb-4 mr-5">
                                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                                <textarea id="direccion" name="direccion" rows="3" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...register("direccion", { required: { value: true, message: 'La dirección es requerida' } })}></textarea>
                                {errors.direccion && <span className="text-red-500">{errors.direccion.message}</span>}
                            </div>
                        </div>
                        <div className="flex mt-5 justify-end gap-x-3">
                            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={handleCancel}>Cancelar</button>
                            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
}
