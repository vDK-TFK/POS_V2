import { Plus, PlusIcon, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";


export default function Movimientos({ open, onClose, cajaActual }) {

    const options = [{ value: 1, label: "Entrada" }, { value: 2, label: "Salida" }];

    async function onPost_Movimiento() {
        let monto = getItemValue("txtMontoMovimiento");
        let comentario = getItemValue("txtComentarioMovimiento");
        let tipoMovimiento = getItemValue("selTipoMovimiento");

        if (monto == "") {
            toast.warning("Debe indicar un monto válido");
        }

        if(comentario == ""){
            toast.warning("Debe indicar un comentario válido");
        }

        if(tipoMovimiento == ""){
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

                if(result.status == "success"){

                    toast.success('Movimiento agregado correctamente');
                    onClean_Inputs();
                    onClose();
                }
                else
                {  
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



    const getItemValue = (id) => {
        return document.getElementById(id).value;
    }

    const onClean_Inputs = () => {

        document.getElementById("selTipoMovimiento").value = "";


        document.getElementById("txtMontoMovimiento").value = "";


        document.getElementById("txtComentarioMovimiento").value = "";



    }



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
                            <PlusIcon />Nuevo Movimiento
                        </h2>
                        <hr className="my-3 py-0.5  border-black dark:border-white" />

                    </div>
                    <form className="my-2 w-full flex flex-col items-center">
                        <div className="pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto">
                            <div className="md:col-span-6">
                                <HtmlFormSelect legend={"Tipo de Movimiento"} options={options} id={"selTipoMovimiento"} />
                            </div>
                            <div className="md:col-span-6">
                                <HtmlFormInput legend={"Monto"} type={"number"} id={"txtMontoMovimiento"} />
                            </div>
                            <div className="md:col-span-12">
                                <HtmlFormInput legend={"Comentario"} id={"txtComentarioMovimiento"} />
                            </div>

                        </div>
                        <div className="mt-6 pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto">
                            <div className="md:col-span-6">
                                <HtmlButton color={"green"} onClick={()=>{onPost_Movimiento()}} icon={Plus} legend={"Registrar"} />
                            </div>
                            <div className="md:col-span-6">
                                <HtmlButton onClick={()=>{onClose()}} color={"red"} icon={X} legend={"Cancelar"} />

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster richColors />
        </div>
    );
}