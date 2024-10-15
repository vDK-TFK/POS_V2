import { InfoCircledIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from 'sonner';
import HtmlLabel from "../HtmlHelpers/Label";

export default function VerCaja({ open, onClose, idInfoCaja }) {
    const [loading, setLoading] = useState(false);
    const [datosCaja, setDatosCaja] = useState(null);

    // Fetching data
    const fetchMovimientos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/caja/facturas/${idInfoCaja}`);
            const result = await response.json();

            if (result.status === "success") {
                setDatosCaja(result.data);
            } else if (result.code === 204) {
                toast.warning('No se encontraron datos');
            } else {
                toast.error('Error al obtener los movimientos');
            }
        } catch (error) {
            toast.error('Sucedió un error al obtener los movimientos');
        } finally {
            setLoading(false);
        }
    }, [idInfoCaja]);

    useEffect(() => {
        if (open) {
            fetchMovimientos();
        }
    }, [open, fetchMovimientos]);

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}
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
                        <div className="w-full flex items-center justify-center">
                            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" role="status">
                                <span className="visually-hidden"></span>
                            </div>
                        </div>
                    ) : (
                        datosCaja && (
                            <div>
                                <div className="grid grid-cols-3 gap-3 m-2">
                                    <HtmlLabel color="blue" legend={`Inicio de Caja: ₡${datosCaja.montoInicioCaja}`} />
                                    <HtmlLabel color="green" legend={`Entradas: ₡${datosCaja.totalEntradas}`} />
                                    <HtmlLabel color="yellow" legend={`Facturado: ₡${datosCaja.totalFacturado}`} />
                                </div>
                                <div className="grid grid-cols-3 gap-3 m-2">
                                    <HtmlLabel color="green" legend={`Cierre de Caja: ₡${datosCaja.montoCierreCaja}`} />
                                    <HtmlLabel color="blue" legend={`Salidas: ₡${datosCaja.totalSalidas}`} />
                                    <HtmlLabel color="red" legend={`Diferencia: ₡${datosCaja.diferencia}`} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Toaster richColors />
        </div>
    );
}
