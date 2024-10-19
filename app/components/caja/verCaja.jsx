import { InfoCircledIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from 'sonner';
import HtmlLabel from "../HtmlHelpers/Label";
import { ClipLoader } from "react-spinners";
import HtmlNewLabel from "../HtmlHelpers/Label1";

export default function VerCaja({ open, onClose, idInfoCaja }) {
    const [loading, onSet_Loading] = useState(false);
    const [datosCaja, onSet_DatosCaja] = useState(null);

    // Obtener la info de esa caja
    const onGet_CajaResumen = useCallback(async () => {
        try {
            onSet_Loading(true);
            const response = await fetch(`/api/caja/facturas/${idInfoCaja}`);
            const result = await response.json();

            if (result.status == "success") {
                toast.success(result.message)
                onSet_DatosCaja(result.data);
            } 
            else if (result.code === 204) {
                toast.warning(result.message);
            } 
            else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error al obtener la información de la caja:', error);
            toast.error('Error al obtener la información de la caja: ' + error );
        } finally {
            onSet_Loading(false);
        }
    }, [idInfoCaja]);

    useEffect(() => {
        if (open) {
            onGet_CajaResumen();
        }
    }, [open, onGet_CajaResumen]);

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-5/12`}
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
                            <InfoCircledIcon />Información Caja # {idInfoCaja}
                        </h2>
                        <hr className="my-3 py-0.5 border-black dark:border-white" />
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center mt-20">
                            <ClipLoader size={30} speedMultiplier={1.5} />
                        </div>
                    ) : (
                        datosCaja && (
                            <div>
                                <div className="grid grid-cols-3 gap-3 m-2">
                                    <HtmlNewLabel color="blue" legend={`Inicio de Caja: ₡${datosCaja.montoInicioCaja}`} />
                                    <HtmlNewLabel color="lime" legend={`Total Entradas: ₡${datosCaja.totalEntradas}`} />
                                    <HtmlNewLabel color="green" legend={`Total Facturado: ₡${datosCaja.totalFacturado}`} />
                                </div>
                                <div className="grid grid-cols-3 gap-3 m-2">
                                    <HtmlNewLabel color="red" legend={`Cierre de Caja: ₡${datosCaja.montoCierreCaja}`} />
                                    <HtmlNewLabel color="orange" legend={`Total Salidas: ₡${datosCaja.totalSalidas}`} />
                                    <HtmlNewLabel color="slate" legend={`Total Diferencia: ₡${datosCaja.diferencia}`} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
