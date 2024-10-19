import { FormatOnlyDate, RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";
import { Ban, Calendar, Plus, PlusIcon, Printer, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Toaster, toast } from "sonner";
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import HtmlLabel from "../HtmlHelpers/Label";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import TicketMovimiento from "./printTicket";
import HtmlNewLabel from "../HtmlHelpers/Label1";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

export default function ListaMovimientos({ open, onClose, cajaActual, idInfoCaja, }) {
  const options = [
    { value: 1, label: "Entrada" },
    { value: 2, label: "Salida" },
  ];
  const [listaMovimientos, onSet_ListaMovimientos] = useState([]);
  const [onLoading, onSet_onLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const ticketRef = useRef();
  const [printReady, setPrintReady] = useState(false);

  //#region [Paginación]
  const [registrosPorPagina] = useState(3);
  const [paginaActual, onSet_PaginaActual] = useState(1);
  const indexOfLastMovimiento = paginaActual * registrosPorPagina;
  const indexOfFirstMovimiento = indexOfLastMovimiento - registrosPorPagina;
  const currentMovimientos = listaMovimientos.slice(
    indexOfFirstMovimiento,
    indexOfLastMovimiento
  );
  const paginate = (pageNumber) => onSet_PaginaActual(pageNumber);

  //#endregion

  //Sesion
  const { data: session } = useSession();



  // Estado del formulario
  const [formData, setFormData] = useState({
    monto: "",
    motivo: "",
    idTipoMovimiento:""
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (selectedItem) {
      setPrintReady(true);
    }
  }, [selectedItem]);

  const handlePrintClick = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
    documentTitle: "Comprobante de Movimiento de Dinero",
  });

  const handleClose = () => {
    setFormData({
      monto:"",
      idTipoMovimiento:"",
      motivo:""
    });
    RemoveValidationClasses("fc-movimientos")
    onClose()
  };

  const onGet_ListaMovimientos = useCallback(async () => {
    try {
      onSet_onLoading(true);
      const response = await fetch(`/api/caja/movimientos/${idInfoCaja}`);
      const result = await response.json();

      if (result.status == "success") {
        onSet_ListaMovimientos(result.data);
      } 
      else if (result.code == 204) {
        toast.warning(result.message);
        onSet_ListaMovimientos([]);
      } 
      else {
        toast.error(result.message);
        onSet_ListaMovimientos([]);
      }
    } catch (error) {
      console.error("Error al obtener la lista de movimientos:", error);
      toast.error("Sucedió un error al obtener los movimientos: " + error);
    } finally {
      onSet_onLoading(false);
    }
  }, [idInfoCaja]);

  useEffect(() => {
    if (open) {
      onGet_ListaMovimientos();
    }
  }, [open, onGet_ListaMovimientos]);

  async function onPost_Movimiento() {
    let isValid = ValidateFormByClass("fc-movimientos")
    if(!isValid){
      toast.warning("Aún existen campos requeridos")
    }
    else {
      let model = {
        idTipoMovimiento:Number(formData.idTipoMovimiento),
        motivo:formData.motivo,
        monto:formData.monto,
        idInfoCaja:Number(idInfoCaja),
        idUsuarioCreacion: Number(session?.user.id)
      };
      
      try {
        const response = await fetch("/api/caja/movimientos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(model),
        });

        const result = await response.json();

        if (result.status == "success") {
          toast.success("Movimiento agregado correctamente");
          onGet_ListaMovimientos();
          RemoveValidationClasses("fc-movimientos")
          setFormData({
            monto: "",
            idTipoMovimiento: "",
            motivo: ""
          });
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Sucedió un error registrar el movimiento: " + error);
        console.error("Sucedió un error registrar el movimiento",error);
      }
    }
  }

  async function onUpdate_Movimiento(id) {
    let model = {
      idMovimiento: id,
    };

    try {
      const response = await fetch("/api/caja/movimientos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      });

      const result = await response.json();

      if (result.status == "success") {
        toast.success(result.message);
        onGet_ListaMovimientos();
      } 
      else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Sucedió un error al anular el movimiento: ` + error);
      console.error("Sucedió un error al anular el movimiento",error);
    }
  }

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"
          } max-w-3xl w-full md:w-2/3 lg:w-6/12`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="flex flex-col items-center">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
              <PlusIcon /> Movimientos de Dinero
            </h2>
            <hr className="my-3 py-0.5 border-black dark:border-white" />
          </div>
          {cajaActual && (
            <div className="flex flex-col items-center">
              <form className="my-2 w-full flex flex-col items-center">
                <div className="pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto w-full">
                  <div className="md:col-span-4">
                    <HtmlFormSelect legend={"Tipo de Movimiento"} value={formData.idTipoMovimiento} additionalClass={"fc-movimientos"} onChange={handleChange} options={options} name={"idTipoMovimiento"} />
                  </div>
                  <div className="md:col-span-4">
                    <HtmlFormInput legend={"Monto"} type={"number"} value={formData.monto} additionalClass={"fc-movimientos"} onChange={handleChange} name={"monto"} />
                  </div>
                  <div className="md:col-span-4">
                    <HtmlFormInput legend={"Comentario"} value={formData.motivo} additionalClass={"fc-movimientos"} onChange={handleChange} name={"motivo"} />
                  </div>
                </div>
                <div className="mt-6 pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto w-full">
                  <div className="md:col-span-3">
                    <HtmlButton color={"green"} onClick={onPost_Movimiento} icon={Plus} legend={"Registrar"} />
                  </div>
                  <div className="md:col-span-3">
                    <HtmlButton onClick={handleClose} color={"red"} icon={X} legend={"Cerrar"} />
                  </div>
                </div>
              </form>
            </div>
          )}
          {listaMovimientos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-1 mt-8 mx-auto w-full">
              {onLoading ? (
                <div className="flex items-center justify-center mt-20">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <div className="pt-1">
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="overflow-auto max-h-72">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" style={{ tableLayout: "auto" }}>
                          <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "50px", maxWidth: "70px" }}>
                                No.
                              </th>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "70px", maxWidth: "70px" }}>
                                Fecha
                              </th>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "80px", maxWidth: "100px" }}>
                                Tipo Mov.
                              </th>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "80px", maxWidth: "120px" }}>
                                Estado
                              </th>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "100px", maxWidth: "150px" }}>
                                Monto
                              </th>
                              <th scope="col" className="px-6 py-2" style={{ minWidth: "110px", maxWidth: "160px" }}>
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentMovimientos.map(
                              (item, index) =>
                                item !== null && (
                                  <tr key={index} className="bg-white dark:bg-gray-800">
                                    <td className="px-6 py-1" style={{ width: "5%" }}>
                                      {item.idMovimiento}
                                    </td>
                                    <td className="px-1 py-1" style={{ width: "5%" }}>
                                      <HtmlNewLabel textSize="xs" icon={Calendar} color={"blue"} legend={FormatOnlyDate(item.fechaCreacion)} />
                                    </td>
                                    <td className="px-6 py-1 text-black" style={{ width: "10%" }}>
                                      {item.TipoMovimiento.nombre}
                                    </td>
                                    <td className="px-6 py-1 text-black" style={{ width: "10%" }}>
                                      {item.idEstadoMovimiento === 1 ? (
                                        "Pendiente"
                                      ) : item.idEstadoMovimiento === 2 ? (
                                        null
                                      ) : item.idEstadoMovimiento === 3 ? (
                                        "Nulo"
                                      ) : null}
                                    </td>
                                    <td className="px-6 py-1 text-black" style={{ width: "10%" }}>
                                      ₡ {item.monto}
                                    </td>
                                    <td className="px-6 py-1" style={{ width: "10%", display: "flex", justifyContent: "space-around" }}>
                                      <HtmlTableButton tooltip={"Imprimir recibo movimiento"} size={12} padding={2} color={"teal"} icon={Printer} onClick={() => { setSelectedItem(item); handlePrintClick(item); }} />

                                      {item.idEstadoMovimiento === 1 && cajaActual && (
                                        <HtmlTableButton tooltip={"Anular Movimiento"} size={12} padding={2} color={"red"} icon={Ban} onClick={() => onUpdate_Movimiento(item.idMovimiento)} />
                                      )}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>


                    </div>
                  </div>
                  <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
                    <ul className="inline-flex -space-x-px text-sm h-8">
                      <li>
                        <button
                          onClick={() => paginate(paginaActual - 1)}
                          disabled={paginaActual === 1}
                          className={`flex items-center justify-center px-3 h-8 ${paginaActual === 1
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                          Anterior
                        </button>
                      </li>
                      {[
                        ...Array(
                          Math.ceil(
                            listaMovimientos.length / registrosPorPagina
                          )
                        ).keys(),
                      ].map((number) => (
                        <li key={number + 1}>
                          <button
                            onClick={() => paginate(number + 1)}
                            className={`flex items-center justify-center px-3 h-8 ${paginaActual === number + 1
                              ? "bg-gray-300 dark:bg-gray-600"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                          >
                            {number + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => paginate(paginaActual + 1)}
                          disabled={
                            paginaActual ===
                            Math.ceil(
                              listaMovimientos.length / registrosPorPagina
                            )
                          }
                          className={`flex items-center justify-center px-3 h-8 ${paginaActual ===
                            Math.ceil(
                              listaMovimientos.length / registrosPorPagina
                            )
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedItem && (
          <div style={{ display: "none" }}>
            <TicketMovimiento ref={ticketRef} item={selectedItem} />
          </div>
        )}
      </div>
    </div>
  );
}
