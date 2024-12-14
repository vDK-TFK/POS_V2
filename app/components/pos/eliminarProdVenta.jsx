import HtmlButton from "@/app/components/HtmlHelpers/Button";
import { Check, CircleAlert, Trash, X } from "lucide-react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Toaster, toast } from 'sonner';
import ModalTemplate from "../HtmlHelpers/ModalTemplate";

export default function EliminarProdVenta({ open, onClose, productoVenta, reloadTable }) {

    const [onLoading, onSet_Loading] = useState(false);

    const eliminarProdVenta = (id) => {
        eliminar(id);
    };

    const eliminar = async (productoVentaId) => {
        onSet_Loading(true);

        try {
            const response = await fetch(`/api/productosventa`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idProductoVenta: productoVentaId, eliminado: true })
            });
            const result = await response.json();

            if (result.status === "success") {
                toast.success('Producto eliminado satisfactoriamente');
                onClose();
                if (reloadTable) {
                    reloadTable();
                }
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Sucedió un error al eliminar el producto:', error);
            toast.error('Sucedió un error al eliminar el producto: ' + error);
        } finally {
            onSet_Loading(false);
        }
    };

    const modalChild = (
        <>
            {productoVenta ? (
                <>
                    <p className="text-md text-gray-800 dark:text-gray-100">
                        ¿Seguro que desea eliminar este producto?
                    </p>
                    <br />
                    <p className="text-xl text-gray-800 dark:text-gray-100">
                        <strong>{productoVenta.nombre}</strong>
                    </p>

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
                                    <HtmlButton color={"red"} legend={"Cancelar"} icon={X} onClick={onClose} />
                                </div>
                            </>
                        )}
                    </form>
                </>
            ) : (
                <p className="text-red-500">No se encontró el producto.</p>
            )}
        </>
    );

    return (
        <ModalTemplate
            open={open}
            onClose={onClose}
            children={modalChild}
            icon={Trash}
            title={"Eliminar Producto Venta"}
        />
    );
}
