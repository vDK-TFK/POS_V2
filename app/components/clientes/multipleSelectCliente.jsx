import { Pointer, User, User2, X } from "lucide-react";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import { useState } from "react";
import TablePagination from "../HtmlHelpers/Pagination";
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function MultipleSelectCliente({ open, onClose, listaClientes, handleClienteInput }) {
  //Paginación
  const [registrosPorPagina] = useState(3);
  const [paginaActual, onSet_PaginaActual] = useState(1);
  const indexOfLastClient = paginaActual * registrosPorPagina;
  const indexOfFirstClient = indexOfLastClient - registrosPorPagina;
  const currentClientes = listaClientes.slice(indexOfFirstClient, indexOfLastClient);
  
  const modalChild = (
    <div className="overflow-auto w-full">
      <div className="shadow-xl border-2 bg-white dark:bg-gray-700 px-1 py-1 rounded-xl mt-4">
        <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ overflow: 'auto', maxHeight: '30rem' }}>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400">
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
      <TablePagination onSet_PaginaActual={onSet_PaginaActual} paginaActual={paginaActual} listado={listaClientes} />
    </div>
  );

  return (
    <ModalTemplate open={open} onClose={onClose} icon={User2} title={"Seleccionar Cliente"}>
      <div className="overflow-auto w-full">
        <div className="shadow-xl border-2 bg-white dark:bg-gray-700 px-1 py-1 rounded-xl mt-4">
          <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ overflow: 'auto', maxHeight: '30rem' }}>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white uppercase bg-gray-900 dark:bg-gray-700 dark:text-gray-400">
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
        <TablePagination onSet_PaginaActual={onSet_PaginaActual} paginaActual={paginaActual} listado={listaClientes} />
      </div>
    </ModalTemplate>
  );
}
