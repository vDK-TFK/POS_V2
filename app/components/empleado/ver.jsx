import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function Ver({ open, onClose, employeeId }) {
    const [empleado, setEmpleado] = useState(null);
    const [horario, setHorario] = useState(null);

    useEffect(() => {
        const fetchEmpleado = async () => {
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
        };
        fetchEmpleado();
    }, [employeeId]);

    useEffect(() => {
        const fetchHorario = async () => {
            if (employeeId) {
                try {
                    const response = await fetch(`/api/horario/${employeeId}`);
                    if (response.ok) {
                        const data = await response.json();
                        const horarioData = { 
                            lunes: { inicio: '', fin: '', es_dia_libre: false },
                            martes: { inicio: '', fin: '', es_dia_libre: false },
                            miércoles: { inicio: '', fin: '', es_dia_libre: false },
                            jueves: { inicio: '', fin: '', es_dia_libre: false },
                            viernes: { inicio: '', fin: '', es_dia_libre: false },
                            sábado: { inicio: '', fin: '', es_dia_libre: false },
                            domingo: { inicio: '', fin: '', es_dia_libre: false }
                        };

                        data.forEach(horario => {
                            const dia = horario.dia.toLowerCase();
                            if (horarioData[dia]) {
                                horarioData[dia] = {
                                    inicio: horario.inicio,
                                    fin: horario.fin,
                                    es_dia_libre: horario.esDiaLibre
                                };
                            }
                        });

                        setHorario(horarioData);
                    } else {
                        toast.error('No se pudieron cargar los datos del horario');
                    }
                } catch (error) {
                    toast.error('Error al cargar los datos del horario');
                }
            }
        };
        fetchHorario();
    }, [employeeId]);

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 transition-opacity ${open ? "visible" : "invisible"}`}>
                <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-xl shadow-lg p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} max-w-full sm:max-w-3xl lg:max-w-4xl`}>
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">
                        <X />
                    </button>
                    <div className="w-full">
                        <div className="mx-auto my-4 w-full max-w-4xl px-4">
                            <h2 className="text-2xl font-bold flex gap-3 text-center text-gray-900">Ver empleado</h2>
                            <hr className="my-3 border border-black" />
                        </div>
                        {empleado && (
                            <div className="my-4 w-full px-4">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Nombre</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.nombre}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Apellidos</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.apellido}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Fecha de Contratación</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{new Date(empleado.createdAt).toLocaleDateString()}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Última Actualización</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{new Date(empleado.updatedAt).toLocaleDateString()}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Correo</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.email}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Teléfono</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.telefono}</dd>
                                    </div>
                                    <div className="mb-4">
                                        <dt className="text-sm font-medium text-gray-700">Rol</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.Role?.Descripcion || "No asignado"}</dd>
                                    </div>
                                    <div className="mb-4 col-span-2">
                                        <dt className="text-sm font-medium text-gray-700">Dirección</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{empleado.direccion}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                        {horario && (
                            <div className="my-4 w-full px-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Horario</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {Object.keys(horario).map(dia => (
                                                <tr key={dia}>
                                                    <td className="px-4 py-2 text-sm text-gray-900 capitalize">{dia}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">
                                                        {horario[dia].es_dia_libre ? 'N/A' : horario[dia].inicio}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">
                                                        {horario[dia].es_dia_libre ? 'N/A' : horario[dia].fin}
                                                    </td>
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-4 mt-4 px-4">
                            <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6 text-white" onClick={onClose}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster richColors />
        </>
    );
}
