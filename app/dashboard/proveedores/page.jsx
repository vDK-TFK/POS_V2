'use client';

import Agregar from "@/app/components/proveedor/crear";
import { CirclePlus, FileUp, Pencil, SlidersHorizontal, Trash, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import Eliminar from "../../components/proveedor/eliminar";
import Buscador from "../../components/buscador/buscar";
import Editar from "@/app/components/proveedor/editar";
import Ver from "@/app/components/proveedor/ver";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Proveedores() {
    const [open, setOpen] = useState(false);
    const [agregar, setAgregar] = useState(false);
    const [ver, setVer] = useState(false);
    const [editar, setEditar] = useState(false);
    const [selectedProveedorId, setSelectedProveedorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const { data, error, mutate } = useSWR(`/api/proveedor`, fetcher);

    useEffect(() => {
        if (data) {
            setFilteredData(data);
        }
    }, [data]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const lowerCaseTerm = term.toLowerCase();
            setFilteredData(data.filter(proveedor =>
                proveedor.Nombre.toLowerCase().includes(lowerCaseTerm) ||
                proveedor.ProveedorID.toString().includes(lowerCaseTerm)
            ));
        } else {
            setFilteredData(data);
        }
    };

    if (error) return <div>Error al cargar los datos</div>;
    if (!data) return <div>Cargando...</div>;
    if (!data || !Array.isArray(data)) return <div>No hay datos disponibles</div>;

    const eliminarProveedor = async (proveedorId) => {
        await fetch(`/api/proveedor/${proveedorId}`, {
            method: 'DELETE',
        });
        mutate(data.filter(proveedor => proveedor.ProveedorID !== proveedorId), false);
        setOpen(false);
    };

    return (
        <>
            <div className="w-full">
                <div className="grid grid-cols-10 gap-4 max-w-7xl mx-auto py-4">
                    <h1 className="font-semibold col-span-10 text-3xl text-gray-900 dark:text-gray-100">Proveedores</h1>
                    <div className="col-span-3">
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
                    <div className="shadow-lg col-span-10 bg-white dark:bg-gray-700 px-5 py-4 rounded-lg">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Id</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Nombre</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Teléfono</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Correo Electrónico</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((proveedor) => (
                                    <tr className="" key={proveedor.ProveedorID}>
                                        <td className="text-center text-sm text-gray-700 whitespace-nowrap">
                                            <a href="#" className="font-bold text-blue-700 hover:underline">{proveedor.ProveedorID}</a>
                                        </td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200 py-4">{proveedor.Nombre}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{proveedor.Telefono}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200">{proveedor.Email}</td>
                                        <td className="flex gap-1 justify-evenly my-1 whitespace-nowrap">
                                            <button className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform bg-blue-600 bg-opacity-50 rounded-md" onClick={() => {
                                                setSelectedProveedorId(proveedor.ProveedorID);
                                                setEditar(true);
                                            }}><Pencil size={15} strokeWidth={2.2} /></button>
                                            <button className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform bg-green-600 bg-opacity-50 rounded-md" onClick={() => {
                                                setSelectedProveedorId(proveedor.ProveedorID);
                                                setVer(true);
                                            }}><Eye size={15} strokeWidth={2.2} /></button>
                                            <button className="p-1.5 text-gray-900 dark:text-gray-200 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform bg-red-600 bg-opacity-50 rounded-md" onClick={() => {
                                                setSelectedProveedorId(proveedor.ProveedorID);
                                                setOpen(true);
                                            }}><Trash size={15} strokeWidth={2.2} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Eliminar open={open} onClose={() => setOpen(false)} proveedorId={selectedProveedorId} onEliminar={eliminarProveedor} />
                <Agregar open={agregar} onClose={() => setAgregar(false)} mutate={mutate} />
                <Ver open={ver} onClose={() => setVer(false)} proveedorId={selectedProveedorId} />
                <Editar open={editar} onClose={() => setEditar(false)} proveedorId={selectedProveedorId} mutate={mutate} />
            </div>
        </>
    );
}
