'use client'
import * as XLSX from "xlsx-js-style"; // Asegúrate de importar la librería correcta

import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlLabel from "@/app/components/HtmlHelpers/Label";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import ActivarCliente from "@/app/components/clientes/activarCliente";
import AgregarCliente from "@/app/components/clientes/agregarCliente";
import EditarCliente from "@/app/components/clientes/editarCliente";
import EliminarCliente from "@/app/components/clientes/eliminarCliente";
import Buscador from "@/app/components/buscador/buscar";
import { Ban, BanIcon, Calendar, Check, Edit3, File, FileSpreadsheetIcon, LockKeyhole, Pencil, PhoneCall, PlusCircle, Save, Smartphone, Trash, UnlockKeyhole, UserPlus } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
// import * as XLSX from 'xlsx';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from "react-spinners";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import { FormatDate } from "@/app/api/utils/js-helpers";
import ModalBloquearDesbloquear from "@/app/components/utilities/bloquear";

const itemsBreadCrumb = ["Dashboard", "Clientes"];

export default function Clientes() {
    //Variables
    const [onLoading, onSet_onLoading] = useState(false);
    const [paginaActual, onSet_PaginaActual] = useState(1);
    const [registrosPorPagina] = useState(5); // Cantidad de registros por página
    const fetchCalled = useRef(false);
    const [listaClientes, onSet_ListaClientes] = useState([]);
    const [idCliente, onSet_IdCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const[agregarCliente,onModal_AgregarCliente] = useState(false);
    const[editarCliente,onModal_EditarCliente] = useState(false);
    const[bloquearDesbloquear,onModal_BloquearDesbloquear] = useState(false);
    const[esBloquear,onSet_EsBloquear] = useState(false);

    //Paginación
    const indexOfLastClient = paginaActual * registrosPorPagina;
    const indexOfFirstClient = indexOfLastClient - registrosPorPagina;
    const currentClientes = listaClientes.slice(indexOfFirstClient, indexOfLastClient);
    const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);

    //Listado de clientes
    const onGet_ListaClientes = useCallback(async () => {
        onSet_onLoading(true);
        try {
            const response = await fetch(`/api/clientes`);
            const result = await response.json();
            if (result.status === "success") {
                onSet_ListaClientes(result.data)
                toast.success('Se han obtenido los registros');
            }
            else if (result.code === 204) {
                toast.warning('No se encontraron registros');
                onSet_ListaClientes([])
            }
            else {
                console.log(result.message);
                toast.error('Error al obtener los registros');
                onSet_ListaClientes([])
            }
        }
        catch (error) {
            console.error('Error al obtener la lista de clientes:', error);
            toast.error('Sucedió un error al obtener la lista de usuarios');
            onSet_ListaClientes([])
        }
        finally {
            onSet_onLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            onGet_ListaClientes();
        }
    }, [onGet_ListaClientes]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };
    
    const filteredData = currentClientes.filter(cliente => {
        const nombreCompleto = `${cliente.nombreCompleto.toLowerCase()}}`;
        return nombreCompleto.includes(searchTerm.toLowerCase()) || cliente.idCliente.toString().includes(searchTerm);
    });

    const handleExport = () => {
        if (typeof document !== 'undefined') {
            generateExcelReport(filteredData);
        }
    };

    const generateExcelReport = (data) => {
        const formattedData = data.map(cliente => {
            return {
                "ID Cliente": cliente.idCliente,
                "Nombre": cliente.nombreCompleto,
                "Estado": cliente.eliminado ? 'Inactivo' : 'Activo',
                "Teléfonos": cliente.celular ? `${cliente.telefono} / ${cliente.celular}` : cliente.telefono,
                "Creado El": FormatDate(cliente.fechaCreacion),
            };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
        // Ejemplo de estilos personalizados
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } }, // Texto en negrita y blanco
            fill: { fgColor: { rgb: "4F81BD" } }, // Fondo azul
            alignment: { horizontal: "center", vertical: "center" }, // Alineación
            border: { // Bordes para las celdas
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };
    
        // Aplica el estilo a los encabezados (primera fila)
        const range = XLSX.utils.decode_range(worksheet['!ref']); // Obtén el rango de la hoja
        for (let C = range.s.c; C <= range.e.c; C++) { // Itera sobre las columnas
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Dirección de la celda
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = headerStyle; // Aplica el estilo a los encabezados
        }
    
        // Aplica estilos a las demás celdas si es necesario
        const cellStyle = {
            alignment: { horizontal: "left", vertical: "center" }, // Alineación de las celdas de datos
            font: { color: { rgb: "333333" } } // Color del texto
        };
        for (let R = range.s.r + 1; R <= range.e.r; R++) { // Itera sobre las filas (excluyendo la primera)
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!worksheet[cellAddress]) continue;
                worksheet[cellAddress].s = cellStyle; // Aplica el estilo a las celdas de datos
            }
        }
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(dataBlob);
        downloadLink.download = "ReporteClientes.xlsx";
        downloadLink.click();
    };
    

    return (
        <>
            <div className="w-full p-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="pl-2 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <HtmlBreadCrumb items={itemsBreadCrumb} />
                    </ol>
                </nav>
            </div>

            <div className="w-full pl-4 pr-4">
                <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Administración de Clientes
                    </h5>

                    {onLoading
                        ? (
                            <ClipLoader size={30} speedMultiplier={1.5} />
                        )
                        :
                        (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto">
                                    <HtmlButton colSize={2}  color={"blue"} icon={UserPlus} legend="Nuevo Cliente" onClick={() => { onModal_AgregarCliente(true) }} />
                                    <HtmlButton colSize={3} color={"green"} legend={"Exportar Clientes"} icon={FileSpreadsheetIcon} onClick={handleExport} />     
                                </div>
                            </>
                        )
                    }

                    {onLoading ? (
                        <div className="flex items-center justify-center mt-20">
                            <ClipLoader size={30} speedMultiplier={1.5} />
                        </div>
                    ) : (

                        <div className="pt-4">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="" style={{ overflow: 'auto', maxHeight: '30rem' }}>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-center" style={{ width: '5%' }}>No.</th>
                                                <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>Nombre Completo</th>
                                                <th scope="col" className="px-6 py-3" style={{ width: '6%' }}>Contacto</th>
                                                <th scope="col" className="px-6 py-3" style={{ width: '5%' }}>Estado</th>
                                                <th scope="col" className="px-6 py-3" style={{ width: '5%' }}>Creado el</th>
                                                <th scope="col" className="px-6 py-3 text-center" style={{ width: '6%' }}>Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {currentClientes.map((item, index) => (
                                                item !== null && (
                                                    <tr key={index} className="bg-white dark:bg-gray-800">
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '5%' }}># {index + 1}</td>
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '10%' }}> {item.nombreCompleto}</td>
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '6%' }}>
                                                            <div className="mb-2" >
                                                                <HtmlNewLabel color={"blue"} icon={PhoneCall} legend={item.telefono} />
                                                            </div>
                                                            <div>
                                                                <HtmlNewLabel color={"violet"} icon={Smartphone} legend={item.celular} />
                                                            </div>


                                                        </td>
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '5%' }}>{item.eliminado ? <HtmlNewLabel color={"red"} icon={Ban} legend={"Bloqueado"} /> : <HtmlNewLabel color={"green"} icon={Check} legend={"Activo"} /> }</td>
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '5%' }}><HtmlNewLabel color={"gray"} icon={Calendar} legend={FormatDate(item.fechaCreacion)} /></td>
                                                        <td className="px-6 py-4 text-gray-900" style={{ width: '6%' }}>
                                                           
                                                            {(item.eliminado ? 
                                                                <>
                                                                    <HtmlTableButton color={"lime"} tooltip={"Activar / Desbloquear"} icon={UnlockKeyhole} onClick={() => { onSet_IdCliente(item.idCliente),onSet_EsBloquear(false), onModal_BloquearDesbloquear(true) }} />
                                                                </>
                                                                :
                                                                <>
                                                                 <HtmlTableButton color={"blue"} tooltip={"Editar Cliente"} icon={Edit3} onClick={() => { onSet_IdCliente(item.idCliente), onModal_EditarCliente(true) }} />
                                                                    <HtmlTableButton color={"red"} tooltip={"Inactivar / Desbloquear"} icon={BanIcon} onClick={() => { onSet_IdCliente(item.idCliente),onSet_EsBloquear(true),  onModal_BloquearDesbloquear(true) }} />
                                                                </>
                                                            )}
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
                                    {[...Array(Math.ceil(listaClientes.length / registrosPorPagina)).keys()].map(number => (
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
                                            disabled={paginaActual === Math.ceil(listaClientes.length / registrosPorPagina)}
                                            className={`flex items-center justify-center px-3 h-8 ${paginaActual === Math.ceil(listaClientes.length / registrosPorPagina) ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}



                </div>
            </div>
            <AgregarCliente open={agregarCliente} onClose={() => onModal_AgregarCliente(false)} onGet_ListaClientes={onGet_ListaClientes} />
            <EditarCliente open={editarCliente} onClose={() => onModal_EditarCliente(false)} idCliente={idCliente} onGet_ListaClientes={onGet_ListaClientes} />
            <ModalBloquearDesbloquear open={bloquearDesbloquear} onClose={() => onModal_BloquearDesbloquear(false)} isBlock={esBloquear} idType={idCliente} onReload={onGet_ListaClientes} entity={"clientes"} />



        </>
    );
}
