'use client';

import Agregar from "@/app/components/proveedor/crear";
import { CirclePlus, FileUp, Pencil, SlidersHorizontal, Trash, Eye, PhoneCall, AtSign, Tag, User, PanelsTopLeft } from "lucide-react";
import { useState, useEffect } from "react";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import Eliminar from "../../components/proveedor/eliminar";
import Buscador from "../../components/buscador/buscar";
import Editar from "@/app/components/proveedor/editar";
import Ver from "@/app/components/proveedor/ver";
import { useCallback } from "react";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Proveedores() {
    const [paginaActual, onSet_PaginaActual] = useState(1);
    const [registrosPorPagina] = useState(5); // Cantidad de registros por página
    const [selectedProveedorId, setSelectedProveedorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [open, setOpen] = useState(false);
    const [agregar, setAgregar] = useState(false);
    const [ver, setVer] = useState(false);
    const [editar, setEditar] = useState(false);

    const { data, error, mutate } = useSWR(`/api/proveedor`, fetcher);

    //Paginación
    const indexOfLastClient = paginaActual * registrosPorPagina;
    const indexOfFirstClient = indexOfLastClient - registrosPorPagina;
    const currentClientes = filteredData.slice(indexOfFirstClient, indexOfLastClient);
    const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);

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
        onSet_PaginaActual(1); // Resetear a la primera página cuando se busca
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
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="" style={{ overflow: 'auto', maxHeight: '30rem' }}>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3 text-center" style={{ width: '10%' }}>ID</th>
                                            <th className="px-6 py-3 text-center" style={{ width: '17%' }}>Nombre</th>
                                            <th className="px-6 py-3 text-center" style={{ width: '10%' }}>Teléfono</th>
                                            <th className="px-6 py-3 text-center" style={{ width: '20%' }}>Correo Electrónico</th>
                                            <th className="px-6 py-3 text-center" style={{ width: '20%' }}>Sitio Web</th>
                                            <th className="px-6 py-3 text-center" style={{ width: '15%' }}>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentClientes.map((proveedor, index) => (
                                            proveedor !== null && (
                                                <tr key={index} className="bg-white dark:bg-gray-800">
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <HtmlNewLabel color={"blue"} icon={Tag} legend={`ID: ${proveedor.ProveedorID}`} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <HtmlNewLabel color={"indigo"} icon={User} legend={`Nombre: ${proveedor.Nombre}`} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <HtmlNewLabel color={"blue"} icon={PhoneCall} legend={proveedor.Telefono} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <HtmlNewLabel color={"violet"} icon={AtSign} legend={proveedor.Email} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <HtmlNewLabel color={"violet"} icon={PanelsTopLeft} legend={proveedor.SitioWeb} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900 dark:text-gray-300">
                                                        <div className="flex gap-2 justify-evenly items-center">
                                                            <HtmlTableButton
                                                                color={"blue"}
                                                                tooltip={"Editar Proveedor"}
                                                                icon={Pencil}
                                                                onClick={() => {
                                                                    setSelectedProveedorId(proveedor.ProveedorID);
                                                                    setEditar(true);
                                                                }}
                                                            />
                                                            <HtmlTableButton
                                                                color={"red"}
                                                                tooltip={"Eliminar Proveedor"}
                                                                icon={Trash}
                                                                onClick={() => {
                                                                    setSelectedProveedorId(proveedor.ProveedorID);
                                                                    setOpen(true);
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Paginación */}
                        <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
                            <ul className="inline-flex -space-x-px text-sm h-8">
                                {/* Botón Anterior */}
                                <li>
                                    <button
                                        onClick={() => paginate(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className={`flex items-center justify-center px-3 h-8 ${paginaActual === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                    >
                                        Anterior
                                    </button>
                                </li>

                                {/* Números de página */}
                                {[...Array(Math.ceil(filteredData.length / registrosPorPagina)).keys()].map(number => (
                                    <li key={number + 1}>
                                        <button
                                            onClick={() => paginate(number + 1)}
                                            className={`flex items-center justify-center px-3 h-8 ${paginaActual === number + 1 ? "bg-gray-300 dark:bg-gray-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            {number + 1}
                                        </button>
                                    </li>
                                ))}

                                {/* Botón Siguiente */}
                                <li>
                                    <button
                                        onClick={() => paginate(paginaActual + 1)}
                                        disabled={paginaActual === Math.ceil(filteredData.length / registrosPorPagina)}
                                        className={`flex items-center justify-center px-3 h-8 ${paginaActual === Math.ceil(filteredData.length / registrosPorPagina) ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                    >
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Mantengo los demás elementos fuera de la tabla */}
                <Eliminar open={open} onClose={() => setOpen(false)} proveedorId={selectedProveedorId} onEliminar={eliminarProveedor} />
                <Agregar open={agregar} onClose={() => setAgregar(false)} mutate={mutate} />
                <Ver open={ver} onClose={() => setVer(false)} proveedorId={selectedProveedorId} />
                <Editar open={editar} onClose={() => setEditar(false)} proveedorId={selectedProveedorId} mutate={mutate} />
            </div>
        </>
    );
}

