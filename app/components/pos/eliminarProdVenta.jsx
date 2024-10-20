import HtmlButton from "@/app/components/HtmlHelpers/Button";
import { Check, CircleAlert, X } from "lucide-react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Toaster, toast } from 'sonner';


export default function EliminarProdVenta({ open, onClose, productoVenta, reloadTable }) {

    const [onLoading, onSet_Loading] = useState(null);

    const eliminarProdVenta = (id) => {
        eliminar(id);

    };

    const eliminar = async (productoVentaId) => {
        onSet_Loading(true)

        try {
            const response = await fetch(`/api/productosventa`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idProductoVenta: productoVentaId, eliminado: true })
            });
            const result = await response.json();

            if(result.status == "success"){
                toast.success('Producto eliminado satisfactoriamente');
                onClose();
                if (reloadTable) {
                    reloadTable();
                }
            }
            else{
                toast.error(result.message)
            }

        } catch (error) {
            console.error('Sucedió un error al eliminar el producto:', error);
            toast.error('Sucedió un error al eliminar el producto: ' + error);
        }
        finally{
            onSet_Loading(false)
        }
    };

    return (
        productoVenta && (
            <div
                className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"
                    }`}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"
                        } max-w-3xl w-full md:w-2/3 lg:w-4/12`}
                >
                    {/* Botón de cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>

                    {/* Contenido del modal */}
                    <div className="flex flex-col items-center">
                        <div className="text-center w-full">
                            <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
                                <CircleAlert /> Confirmar Eliminación
                            </h2>
                            <hr className="my-3 py-0.5 border-black dark:border-white" />
                            <p className="text-md text-gray-800 dark:text-gray-100">
                                ¿Seguro que desea eliminar este producto?
                            </p>
                            <br />
                            <p className="text-xl text-gray-800 dark:text-gray-100">
                                <strong>{productoVenta.nombre}</strong>
                            </p>
                        </div>

                        {/* Formulario de confirmación */}
                        <form className="my-2 w-full flex flex-col items-center">
                            {onLoading ? (
                                <div className="flex items-center justify-center m-1">
                                    <ClipLoader size={30} speedMultiplier={1.5} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center gap-6 mt-5">
                                        {/* Botón de aceptar */}
                                        <HtmlButton
                                            color={"green"}
                                            legend={"Aceptar"}
                                            onClick={() => eliminarProdVenta(Number(productoVenta.productoVentaId))}
                                            icon={Check}
                                        />
                                        {/* Botón de cancelar */}
                                        <HtmlButton color={"gray"} legend={"Cancelar"} icon={X} onClick={onClose} />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}