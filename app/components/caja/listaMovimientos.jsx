import { FormatOnlyDate } from "@/app/api/utils/js-helpers";
import { Ban, Plus, PlusIcon, Printer, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Toaster, toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import HtmlLabel from "../HtmlHelpers/Label";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import TicketMovimiento from "./printTicket";


export default function ListaMovimientos({ open, onClose }) {

    const options = [{ value: 1, label: "Entrada" }, { value: 2, label: "Salida" }];
    const [listaMovimientos, onSet_ListaMovimientos] = useState([]);
    const [onLoading, onSet_onLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const ticketRef = useRef();
    const [printReady, setPrintReady] = useState(false);
    const [cajaActual, onSet_CajaActual] = useState();


    
    

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
        documentTitle: 'Comprobante de Movimiento de Dinero',
    });

    const onGet_ListaMovimientos = useCallback(async () => {
        try {
            onSet_onLoading(true);
            const response = await fetch(`/api/caja/movimientos`);
            const result = await response.json();

            if (result.status === "success") {
                onSet_ListaMovimientos(result.data);
            } else if (result.code === 204) {
                //toast.warning('No se encontraron movimientos');
            } else {
                toast.error('Error al obtener los movimientos');
            }
        } catch (error) {
            toast.error('Sucedió un error al obtener los movimientos');
        } finally {
            onSet_onLoading(false);
        }
    }, []);

    const onGet_CajaActual = useCallback(async () => {
        try {
            onSet_onLoading(true);
            const response = await fetch(`/api/current`);
            if (!response.ok) throw new Error(`Error al obtener la info de caja: ${response.statusText}`);
            const results = await response.json();

            if (results.data.length === 0) {
                //toast.warning(results.message);
                onSet_CajaActual(false);
            } else {
                onSet_CajaActual(results.data);
            }
        } catch (error) {
            toast.error('Sucedió un error al obtener la info de caja');
        } finally {
            onSet_onLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            onGet_ListaMovimientos();
            onGet_CajaActual();
        }
    }, [open, onGet_ListaMovimientos, onGet_CajaActual]);

    async function onPost_Movimiento() {
        let monto = getItemValue("txtMontoMovimiento");
        let comentario = getItemValue("txtComentarioMovimiento");
        let tipoMovimiento = getItemValue("selTipoMovimiento");

        if (monto == "") {
            toast.warning("Debe indicar un monto válido");
        }

        if (comentario == "") {
            toast.warning("Debe indicar un comentario válido");
        }

        if (tipoMovimiento == "") {
            toast.warning("Debe indicar un tipo de movimiento válido");
        }


        else {
            let model = {
                idTipoMovimiento: Number(tipoMovimiento),
                monto: Number(monto),
                motivo: comentario,
                idInfoCaja: cajaActual.idInfoCaja
            }

            try {
                const response = await fetch('/api/caja/movimientos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model)
                });

                const result = await response.json();

                if (result.status == "success") {

                    toast.success('Movimiento agregado correctamente');
                    onClean_Inputs();
                    onGet_ListaMovimientos();
                    //onClose();
                }
                else {
                    console.log(result.message);
                    toast.error('Error al registrar el movimiento');

                }

            }
            catch (error) {
                toast.error("Sucedió un error registrar el movimiento");
                console.error(error);
            }
        }
    }

    async function onUpdate_Movimiento(id, anular) {

        let model = {
            idMovimiento: id,
            esAnular: anular
        }

        try {
            const response = await fetch('/api/caja/movimientos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model)
            });

            const result = await response.json();

            if (result.status == "success") {
                let msg = anular ? 'anulado' : 'pagado';
                toast.success(`Movimiento ${msg} correctamente`);
                onGet_ListaMovimientos();
            }
            else {
                let msg = anular ? 'anular' : 'pagar';
                toast.error(`Error al ${msg} el movimiento`);
                console.log(result.message);
            }

        }
        catch (error) {
            let msg = anular ? 'anular' : 'pagar';
            toast.error(`Sucedió un error al ${msg} el movimiento`);
            console.log(error);
        }

    }

    const getItemValue = (id) => {
        return document.getElementById(id).value;
    }

    const onClean_Inputs = () => {
        document.getElementById("selTipoMovimiento").value = "";
        document.getElementById("txtMontoMovimiento").value = "";
        document.getElementById("txtComentarioMovimiento").value = "";
    };

    const onReturnColor = (id) => {
        if (id == 1) {
            return "text-yellow-600"
        }

        if (id == 2) {
            return "text-green-600"
        }

        if (id == 3) {
            return "text-red-600"
        }
    }

    useEffect(() => {
        onGet_ListaMovimientos();
    }, [onGet_ListaMovimientos]);
    

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-6/12`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                    <X size={20} strokeWidth={2} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="text-center w-full">
                        <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
                            <PlusIcon />Movimientos de Dinero
                        </h2>
                        <hr className="my-3 py-0.5  border-black dark:border-white" />

                    </div>

                    {
                        cajaActual ? (
                            <div className="flex flex-col items-center">
                                <form className="my-2 w-full flex flex-col items-center">
                                    <div className="pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto w-full">
                                        <div className="md:col-span-4">
                                            <HtmlFormSelect legend={"Tipo de Movimiento"} options={options} id={"selTipoMovimiento"} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <HtmlFormInput legend={"Monto"} type={"number"} id={"txtMontoMovimiento"} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <HtmlFormInput legend={"Comentario"} id={"txtComentarioMovimiento"} />
                                        </div>
                                    </div>
                                    <div className="mt-6 pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto w-full">
                                        <div className="md:col-span-3">
                                            <HtmlButton color={"green"} onClick={() => { onPost_Movimiento() }} icon={Plus} legend={"Registrar"} />
                                        </div>
                                        <div className="md:col-span-3">
                                            <HtmlButton onClick={() => { onClose() }} color={"red"} icon={X} legend={"Cerrar"} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : null
                    }



                    {/* Listado */}
                    {
                        listaMovimientos.length > 0 ?
                            (
                                <div className="grid grid-cols-1 md:grid-cols-1 mt-8 mx-auto">
                                    {onLoading ? (
                                        <div className="w-full flex items-center justify-center">
                                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
                                                <span className="visually-hidden"></span>
                                            </div>
                                        </div>
                                    ) : (

                                        <div className="col-span-12">
                                            <div className="relative overflow-x-auto shadow-md rounded-t-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3" style={{ width: '6%' }}>
                                                                No.
                                                            </th>
                                                            <th scope="col" className="px-6 py-3" style={{ width: '18%' }}>
                                                                Fecha
                                                            </th>
                                                            <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>
                                                                Estado
                                                            </th>
                                                            <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>
                                                                Tipo
                                                            </th>
                                                            <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>
                                                                Monto
                                                            </th>

                                                            <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>
                                                                Acciones
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                            <div style={{ maxHeight: '16rem', overflowY: 'auto' }} className="relative overflow-x-auto shadow-md rounded-b-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                                                    <tbody>
                                                        {listaMovimientos.map((item, index) => (
                                                            item !== null && (
                                                                <tr key={index} className="bg-white dark:bg-gray-800">
                                                                    <td className="px-6 py-4"># {item.idMovimiento}</td>
                                                                    <td className="px-6 py-4"><HtmlLabel color={"blue"} legend={FormatOnlyDate(item.fechaCreacion)} /></td>
                                                                    <td className={`px-6 py-4 font-bold ${onReturnColor(item.idEstadoMovimiento)}`}>{item.EstadoMovimiento.nombre}</td>
                                                                    <td className="px-6 py-4">{item.TipoMovimiento.nombre}</td>
                                                                    <td className="px-6 py-4">₡ {item.monto}</td>

                                                                    <td className="px-6 py-4">
                                                                        {item.idEstadoMovimiento === 1 && cajaActual && (
                                                                            <>
                                                                                <HtmlTableButton color={"red"} icon={Ban} onClick={() => onUpdate_Movimiento(item.idMovimiento, true)} />
                                                                                <HtmlTableButton color={"blue"} icon={Printer} onClick={() => { setSelectedItem(item); handlePrintClick(item); }} />
                                                                            </>
                                                                        )}
                                                                        {(item.idEstadoMovimiento === 2) && (
                                                                            <HtmlTableButton color={"blue"} icon={Printer} onClick={() => { setSelectedItem(item); handlePrintClick(item); }} />
                                                                        )}
                                                                    </td>

                                                                </tr>
                                                            )
                                                        ))}
                                                    </tbody>


                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null
                    }

                </div>
            </div>
            <Toaster richColors />
            {selectedItem && (
                <div style={{ display: "none" }}>
                    <TicketMovimiento ref={ticketRef} item={selectedItem} />
                </div>
            )}

        </div>
    );
}