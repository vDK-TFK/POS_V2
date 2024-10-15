import { Pointer, User, X } from "lucide-react";
import HtmlTableButton from "../HtmlHelpers/TableButton";

export default function MultipleSelectCliente({ open, onClose, listaClientes, handleClienteInput }) {
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
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
                {listaClientes.map((c, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-800">
                    <td hidden className="px-6 py-4">{c.clienteId}</td>
                    <td className="px-6 py-4"><span>{c.nombre}</span> <span>{c.apellido}</span></td>
                    <td className="px-6 py-4">
                      <HtmlTableButton color={"blue"} icon={Pointer} onClick={() => handleClienteInput(c)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
