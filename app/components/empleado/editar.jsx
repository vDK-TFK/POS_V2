import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from "react-hook-form";

export default function Editar({ open, onClose, employeeId, mutate }) {
    const [empleado, setEmpleado] = useState(null);
    const [roles, setRoles] = useState([]);
    const { reset } = useForm();

    const nombreRef = useRef();
    const apellidoRef = useRef();
    const correoRef = useRef();
    const telefonoRef = useRef();
    const direccionRef = useRef();
    const rolRef = useRef();

    // Memorize fetchEmpleado with useCallback
    const fetchEmpleado = useCallback(async () => {
        if (employeeId) {
            try {
                const response = await fetch(`/api/empleado/${employeeId}`);
                const result = await response.json();
                if (response.ok) {
                    setEmpleado(result);
                } else {
                    toast.error('Error al obtener los datos del empleado');
                }
            } catch (error) {
                toast.error('Error al obtener los datos del empleado');
            }
        }
    }, [employeeId]);

    // Memorize fetchRoles with useCallback
    const fetchRoles = useCallback(async () => {
        try {
            const response = await fetch('/api/role');
            const result = await response.json();
            if (response.ok) {
                setRoles(result);
            } else {
                toast.error('Error al obtener los roles');
            }
        } catch (error) {
            toast.error('Error al obtener los roles');
        }
    }, []);

    useEffect(() => {
        fetchEmpleado();
        fetchRoles();
    }, [fetchEmpleado, fetchRoles]);

    useEffect(() => {
        if (empleado) {
            nombreRef.current.value = empleado.nombre;
            apellidoRef.current.value = empleado.apellido;
            correoRef.current.value = empleado.email;
            telefonoRef.current.value = empleado.telefono;
            direccionRef.current.value = empleado.direccion;
            rolRef.current.value = empleado.roleId || "";
        }
    }, [empleado]);

    const handleEditar = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/empleado/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombreRef.current.value,
                    apellido: apellidoRef.current.value,
                    email: correoRef.current.value,
                    telefono: telefonoRef.current.value,
                    direccion: direccionRef.current.value,
                    roleId: rolRef.current.value,
                }),
            });

            if (response.ok) {
                const empleadoActualizado = await response.json();
                toast.success('Usuario editado con éxito');
                mutate();
                setTimeout(() => {
                    onClose();
                }, 500);
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Error al editar el empleado');
        }
    };

    const handleCancel = () => {
        fetchEmpleado();  // Reload the original data
        onClose();
    };

    return (
        <div onClick={handleCancel} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
                <button onClick={handleCancel} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <X size={18} strokeWidth={2} />
                </button>
                {empleado && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100 my-4">
                            Editar empleado ID : {empleado.Id}
                        </h2>
                        <hr className="w-full border-t border-gray-300 dark:border-gray-600"></hr>
                        <form onSubmit={handleEditar} className="ml-5 my-4 w-full">
                            <div className="grid mr-5 gap-x-12 grid-cols-2">
                                <div className="mb-4">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
                                    <input required type="text" id="nombre_empleado" ref={nombreRef} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Apellidos</label>
                                    <input required type="text" ref={apellidoRef} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Correo</label>
                                    <input required type="text" id="email" name="email" ref={correoRef} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Telefono</label>
                                    <input required type="text" maxLength="8" id="telefono" name="telefono" ref={telefonoRef} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rol</label>
                                    <select id="rol" name="rol" ref={rolRef} className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                        {roles.map((rol) => (
                                            <option key={rol.IdRole} value={rol.IdRole}>
                                                {rol.Descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4 mr-5">
                                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Descripción</label>
                                <textarea required id="direccion" name="direccion" ref={direccionRef} rows="3" className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            <div className="flex justify-end gap-4 mr-5">
                                <button type="submit" className="bg-verde font-semibold rounded-md py-2 px-6 text-white">Guardar</button>
                                <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6 text-white" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
