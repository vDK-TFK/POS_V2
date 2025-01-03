import { useState } from 'react';
import { Trash, X } from "lucide-react";
import { toast } from 'sonner';
import ModalTemplate from '../HtmlHelpers/ModalTemplate';
import HtmlButton from '../HtmlHelpers/Button';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';

export default function EliminarProveedor({ open, onClose, onReload, item }) {
    const [onLoadingBtn, setLoading] = useState(false);
    const { data: session } = useSession();

    const handleClose = () => {
        onClose();
    };

    const eliminarProveedor = async () => {
        if (!item.ProveedorID) {
            toast.error("No hay proveedor seleccionado para eliminar.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/proveedor/${item.ProveedorID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUsuarioModificacion: Number(session?.user.id) })
            });

            const data = await response.json();

            if (data.status === "success") {
                toast.success(data.message);
                if (onReload) {
                    onReload();
                }
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            toast.error("Error al eliminar el proveedor");
        } finally {
            setLoading(false);
        }
    };

    const modalChild = (
        <>
            <div className="flex flex-col items-center justify-center text-center">
                <p className="font-bold mb-5 text-lg dark:text-white">¿Desea eliminar este registro?</p>
                {item && <p className="text-lg dark:text-white">Proveedor: {item.Nombre}</p>}
            </div>

            {onLoadingBtn ? (
                <div className="flex items-center justify-center mt-20">
                    <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
            ) : (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <HtmlButton onClick={eliminarProveedor} color={"teal"} icon={Trash} legend="Eliminar" />
                    <HtmlButton onClick={handleClose} color={"red"} icon={X} legend="Cancelar" />
                </div>
            )}
        </>
    );

    return (
        <ModalTemplate title={"Eliminar Proveedor"} icon={Trash} open={open} onClose={onClose}>
            <>
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="font-bold mb-5 text-lg dark:text-white">¿Desea eliminar este registro?</p>
                    {item && <p className="text-lg dark:text-white">Proveedor: {item.Nombre}</p>}
                </div>

                {onLoadingBtn ? (
                    <div className="flex items-center justify-center mt-20">
                        <ClipLoader size={30} speedMultiplier={1.5} />
                    </div>
                ) : (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <HtmlButton onClick={eliminarProveedor} color={"teal"} icon={Trash} legend="Eliminar" />
                        <HtmlButton onClick={handleClose} color={"red"} icon={X} legend="Cancelar" />
                    </div>
                )}
            </>
        </ModalTemplate>
    );
}
