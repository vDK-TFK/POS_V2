import { LockIcon, PlusIcon, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { RemoveValidationClasses, ValidateFormByClass } from "@/app/api/utils/js-helpers";

export default function CierreCaja({ open, onClose, idInfoCaja, onGet_ListaInfoCaja, }) {
    //Sesion
    const { data: session } = useSession();

    // Estado del formulario
    const [formData, setFormData] = useState({
        montoCierre: "",
    });

    // Manejador de cambio en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setFormData({
            montoCierre:""
        });
        RemoveValidationClasses("fc-montoCierre")
        onGet_ListaInfoCaja();
        onClose()
    };

    async function onUpdate_Cierre() {
        let isValid = ValidateFormByClass("fc-montoCierre")
        if(!isValid){
            toast.warning("Debe ingresar un monto de cierre")
        }
        else {
            let model = {
                idInfoCaja: idInfoCaja,
                montoCierreCaja: formData.montoCierre,
                idUsuarioModificacion: Number(session?.user.id)
            }

            try {
                const response = await fetch('/api/caja', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model)
                });

                const result = await response.json();

                if (result.status == "success") {
                    toast.success(result.message);
                    handleClose();
                }
                else {
                    console.log(result.message);
                    toast.error('Error al cerrar la caja');

                }
            }
            catch (error) {
                toast.error("Sucedió un error al cerrar la caja");
                console.error(error);
            }
        }
    }

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}  md:w-3/3 lg:w-12/12`}
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
                            <PlusIcon />Cerrar Caja
                        </h2>
                        <hr className="my-3 py-0.5 border-black dark:border-white" />
                    </div>
                    <div className="flex flex-col items-center">
                        <form className="my-2 w-full flex flex-col items-center">
                            <div className="pl-4 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto w-full">
                                <div className="md:col-span-1">
                                    <HtmlFormInput additionalClass={"fc-montoCierre"} legend={"Monto del cierre"} onChange={handleChange} type={"number"} name={"montoCierre"} value={formData.montoCierre} />
                                </div>
                            </div>
                            <div className="mt-6 pl-4 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                                <div className="md:col-span-1">
                                    <HtmlButton color={"green"} onClick={() => { onUpdate_Cierre() }} icon={LockIcon} legend={"Cerrar Caja"} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
