import { Pointer, User, X } from "lucide-react";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import { useState } from "react";

export default function MultipleSelectCliente({ open, onClose, listaClientes, handleClienteInput }) {
  //Paginación
  const [registrosPorPagina] = useState(3);
  const [paginaActual, onSet_PaginaActual] = useState(1);
  const indexOfLastClient = paginaActual * registrosPorPagina;
  const indexOfFirstClient = indexOfLastClient - registrosPorPagina;
  const currentClientes = listaClientes.slice(indexOfFirstClient, indexOfLastClient);
  const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);


  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={20} strokeWidth={2} />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
              <User />Seleccione el cliente
            </h2>
            <hr className="my-3 py-0.5 border-black dark:border-white" />
          </div>
          <div className="overflow-auto w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th hidden scope="col" className="px-6 py-3">IdCliente</th>
                  <th scope="col" className="px-6 py-3" style={{ width: '15%' }}>Nombre Completo</th>
                  <th scope="col" className="px-6 py-3" style={{ width: '5%' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentClientes.map((c, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800">
                    <td hidden className="px-6 py-4">{c.clienteId}</td>
                    <td className="px-6 py-4"><span>{c.nombreCompleto}</span></td>
                    <td className="px-6 py-4">
                      <HtmlTableButton tooltip={"Seleccionar el cliente"} color={"blue"} icon={Pointer} onClick={() => handleClienteInput(c)} />
                    </td>
                  </tr>
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
    </div>
  );
}
