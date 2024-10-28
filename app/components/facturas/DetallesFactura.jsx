import { X } from 'lucide-react';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const DetallesFactura = ({ open, factura, onClose }) => {

    const [onLoading, onSet_onLoading] = useState(false);

    // Paginación
    const [paginaActual, onSet_PaginaActual] = useState(1);
    const [registrosPorPagina] = useState(5);
    const indexOfLastItem = paginaActual * registrosPorPagina;
    const indexOfFirstItem = indexOfLastItem - registrosPorPagina;
    const currentItems = factura?.Detalles?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPaginas = factura?.Detalles ? Math.ceil(factura.Detalles.length / registrosPorPagina) : 1;

    const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);

    // Evitar renderizado si `open` es falso o no hay detalles en la factura
    if (!open || !factura?.Detalles || factura.Detalles.length === 0) {
        return null;
    }




    return (
        <div
            className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
        >
            <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} m-auto max-w-3xl w-full w-4/6 md:w-3/6`}>
                {onLoading ? (
                    <div className="flex items-center justify-center m-1">
                        <ClipLoader size={10} speedMultiplier={1.5} />
                    </div>
                ) : (
                    <>
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                            <X size={20} strokeWidth={2} />
                        </button>
                    </>
                )}

                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        Detalles de Factura
                    </h2>
                    <hr className="w-full border-t border-gray-600 dark:border-gray-500 mt-2"></hr>

                    <div className="pt-4 w-full">
                        {
                            onLoading ? (
                                <div className="flex items-center justify-center m-1">
                                    <ClipLoader size={30} speedMultiplier={1.5} />
                                </div>
                            ) :
                                (
                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full" style={{ maxHeight: '30rem' }}>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3" style={{ width: '3%' }}>No. Línea</th>
                                                    <th scope="col" className="px-6 py-3" style={{ width: '5%' }}>Cant.</th>
                                                    <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>Descripción</th>
                                                    <th scope="col" className="px-6 py-3" style={{ width: '5%' }}>Precio</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {currentItems.map((item, index) => (
                                                    item !== null && (
                                                        <tr key={index} className="bg-white dark:bg-gray-800">
                                                            <td className="px-6 py-4 text-gray-900" style={{ width: '3%' }}># {item.NumeroLinea}</td>
                                                            <td className="px-6 py-4 text-gray-900" style={{ width: '5%' }}> {item.Cantidad}</td>
                                                            <td className="px-6 py-4 text-gray-900" style={{ width: '10%' }}> {item.Descripcion}</td>
                                                            <td className="px-6 py-4 text-gray-900" style={{ width: '5%' }}>₡ {item.Precio}</td>
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                        }


                        {/* Paginación */}
                        <nav className="flex items-center justify-between pt-4 w-full" aria-label="Table navigation">
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
                                {[...Array(Math.ceil(factura.Detalles.length / registrosPorPagina)).keys()].map(number => (
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
                                        disabled={paginaActual === Math.ceil(factura.Detalles.length / registrosPorPagina)}
                                        className={`flex items-center justify-center px-3 h-8 ${paginaActual === Math.ceil(factura.Detalles.length / registrosPorPagina) ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                    >
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default DetallesFactura;
