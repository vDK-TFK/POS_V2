import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Check, CircleAlert, Clock, X } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import HtmlButton from '../HtmlHelpers/Button';
import { useCallback, useState } from 'react';
import { FormatDate, FormatDate12Hours } from '@/app/api/utils/js-helpers';
import HtmlNewLabel from '../HtmlHelpers/Label1';

const MarcarSalida = ({ open, onClose, horaActual, idUsuarioEmpleado, onGet_Asistencia,idAsistencia }) => {
    const fecha = new Date();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const ano = fecha.getFullYear();
    const millis = fecha.getMilliseconds();
    const fechaLocal = `${ano}-${mes}-${dia}T${horaActual}.${millis}Z`;
    const horaCero = "00:00:00.000";
    const fechaHoy = `${ano}-${mes}-${dia}T${horaCero}Z`;
    const [onLoading, onSet_Loading] = useState(false);


    const onSave_MarcarHora = useCallback(async () => {
        if (!idUsuarioEmpleado) {
            toast.error('El ID de usuario no está definido.');
            return;
        }

        onSet_Loading(true);
        let model = {
            idUsuarioEmpleado: idUsuarioEmpleado,
            fechaHoraSalida: fechaLocal,
            idAsistencia:idAsistencia
        };

        try {
            const response = await fetch('/api/marcar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model)
            });

            const data = await response.json();

            if (data.status === "success") {
                toast.success(data.message);
                onGet_Asistencia();
                onClose();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Error al registrar la salida:', error);
            toast.error("Error al registrar la salida: " + error.message);
        } finally {
            onSet_Loading(false);
        }
    }, [idUsuarioEmpleado, fechaLocal, onGet_Asistencia, onClose, idAsistencia]);

    return (
        <>
            <div
                className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-4/12`}>

                    <div className="flex flex-col items-center">
                        <div className="text-center w-full">
                            <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
                                <CircleAlert /> Marcar hora de salida
                            </h2>
                            <hr className="my-3 py-0.5  border-black dark:border-white" />
                            <p className="text-md text-gray-800 dark:text-gray-100">
                                ¿Está seguro que desea marcar la salida al ser las?
                            </p>
                            <p className="mt-2 text-md text-gray-800 dark:text-gray-100">
                                <HtmlNewLabel icon={Clock} color={"emerald"} legend={FormatDate12Hours(new Date())} />
                            </p>

                        </div>
                        <form className="my-2 w-full flex flex-col items-center">
                            {onLoading ? (
                                <div className="flex items-center justify-center m-1">
                                    <ClipLoader size={30} speedMultiplier={1.5} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center gap-6 mt-5">
                                        <HtmlButton onClick={onSave_MarcarHora} color={"green"} legend={"Marcar"} icon={Check} />
                                        <HtmlButton onClick={onClose} color={"gray"} legend={"Cancelar"} icon={X} />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MarcarSalida;
