'use client';

import Agregar from "@/app/components/empleado/crear";
import { CirclePlus, FileUp, Pencil, SlidersHorizontal, Trash, Eye } from "lucide-react";
import { useState } from "react";
import Eliminar from "../../components/empleado/eliminar";
import Evaluar from "@/app/components/empleado/evaluar";
import Editar from "@/app/components/empleado/editar";
import Ver from "@/app/components/empleado/ver";
import useSWR from 'swr';
import { useSession } from "next-auth/react";
import Horario from "@/app/components/empleado/horario";
import HorarioEdit from "@/app/components/empleado/horarioEdit";
import Buscador from "@/app/components/buscador/buscar";

export default function Empleado() {
    const [open, setOpen] = useState(false);
    const [agregar, setAgregar] = useState(false);
    const [ver, setVer] = useState(false);
    const [editar, setEditar] = useState(false);
    const [evaluar, setEvaluar] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [horarioOpen, setHorarioOpen] = useState(false);
    const [horarioEditOpen, setHorarioEditOpen] = useState(false);

    const { data: session, status } = useSession();
    const { data, error, mutate } = useSWR(`/api/empleado`, async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    });

    if (status === "loading") {
        return <div>Cargando...</div>;
    }

    if (status === "error") {
        return <div>Error al cargar la sesión</div>;
    }

   

    if (error) return <div>Error al cargar los datos</div>;
    if (!data || !Array.isArray(data)) return <div>No hay datos disponibles</div>;

    const empleados = data.map(empleado => ({
        ...empleado,
        horarios: empleado.horarios || [] // Asegúrate de que horarios es siempre un array
    }));

    const eliminarEmpleado = (employeeId) => {
        mutate(empleados.filter(empleado => empleado.Id !== employeeId), false);
        setOpen(false);
    };

    const filteredData = empleados.filter(empleado => {
        const nombreCompleto = `${empleado.nombre.toLowerCase()} ${empleado.apellidos.toLowerCase()}`;
        return nombreCompleto.includes(searchTerm.toLowerCase()) || empleado.Id.toString().includes(searchTerm);
    });

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <>
            <div className="w-full">
                <div className="grid grid-cols-10 gap-4 max-w-7xl mx-auto py-4">
                    <h1 className="font-semibold col-span-10 text-3xl text-gray-900 dark:text-gray-100">Empleados</h1>
                    <div className="col-span-7 flex justify-end mb-4 md:mb-0">
                        <Buscador onSearch={handleSearch} />
                    </div>
                    <div className="col-start-8 col-span-3">
                        <div className="flex justify-end gap-6">
                            <button className="flex items-center gap-3 shadow-lg active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform text-white font-semibold bg-green-500 dark:bg-green-600 px-4 py-2 rounded-lg" onClick={() => setAgregar(true)}>
                                <CirclePlus className="text-white" />
                                Agregar
                            </button>
                            <button className="flex gap-3 shadow-lg text-green-500 dark:text-green-400 font-semibold bg-white dark:bg-gray-700 px-4 py-2 active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform border border-green-500 dark:border-green-400 rounded-lg">
                                <FileUp className="text-green-500 dark:text-green-400" />
                                Exportar
                            </button>
                        </div>
                    </div>
                    <div className="shadow-lg col-span-10 bg-white dark:bg-gray-700 px-5 py-4 rounded-lg overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Id</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Nombre</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Apellido</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Correo</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4"># Telefono</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Horario</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((empleado) => (
                                    <tr key={empleado.Id}>
                                        <td className="text-center text-sm text-gray-700 whitespace-nowrap">
                                            <a href="#" className="font-bold text-blue-700 hover:underline">{empleado.Id}</a>
                                        </td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{empleado.nombre}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{empleado.apellido}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{empleado.email}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{empleado.telefono}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">
                                            {empleado.horarios.length === 0 ? 
                                                <button
                                                    className="flex items-center gap-3 shadow-lg active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform text-white font-semibold bg-blue-500 dark:bg-blue-600 px-4 py-2 rounded-lg"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(empleado.Id);
                                                        setHorarioOpen(true);
                                                    }}
                                                >
                                                    Asignar                                               
                                                </button>                                            
                                                :
                                                <button
                                                    className="flex items-center gap-3 shadow-lg active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform text-white font-semibold bg-blue-500 dark:bg-blue-600 px-4 py-2 rounded-lg"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(empleado.Id);
                                                        setHorarioEditOpen(true);
                                                    }}
                                                >
                                                    Editar
                                                </button> }
                                        </td>
                                        <td className="flex gap-2 justify-center my-1 whitespace-nowrap">
                                            <button
                                                className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform bg-blue-600 bg-opacity-50 rounded-md"
                                                onClick={() => {
                                                    setSelectedEmployeeId(empleado.Id);
                                                    setEditar(true);
                                                }}
                                            >
                                                <Pencil size={15} strokeWidth={2.2} />
                                            </button>
                                            <button
                                                className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform bg-green-600 bg-opacity-50 rounded-md"
                                                onClick={() => {
                                                    setSelectedEmployeeId(empleado.Id);
                                                    setVer(true);
                                                }}
                                            >
                                                <Eye size={15} strokeWidth={2.2} />
                                            </button>
                                            <button>
                                                <Evaluar employeeId={empleado.Id} />
                                            </button>
                                            <button
                                                className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform bg-red-600 bg-opacity-50 rounded-md"
                                                onClick={() => {
                                                    setSelectedEmployeeId(empleado.Id);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Trash size={15} strokeWidth={2.2} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Eliminar open={open} onClose={() => setOpen(false)} employeeId={selectedEmployeeId} onEliminar={eliminarEmpleado} />
                <Agregar open={agregar} onClose={() => setAgregar(false)} mutate={mutate} />
                <Editar open={editar} onClose={() => setEditar(false)} employeeId={selectedEmployeeId} mutate={mutate} />
                <Ver open={ver} onClose={() => setVer(false)} employeeId={selectedEmployeeId} />
                <Horario open={horarioOpen} onClose={() => setHorarioOpen(false)}  mutate={mutate} employeeId={selectedEmployeeId} />
                <HorarioEdit open={horarioEditOpen} onClose={() => setHorarioEditOpen(false)}  mutate={mutate} employeeId={selectedEmployeeId} />
            </div>
        </>
    );
}
