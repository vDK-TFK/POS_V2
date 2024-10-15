import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function AddRole({ open, onClose, mutate }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleAgregar = handleSubmit(async (data) => {
        try {
            const res = await fetch('/api/role', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const newRole = await res.json();
                if (newRole) {
                    toast.success('Nuevo rol guardado con éxito');
                    mutate();
                    onClose();
                    reset();
                } else {
                    toast.error('Error al guardar el nuevo rol');
                }
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });

    const handleCancel = () => {
        onClose();
        reset();
    }

    return (
        <div className={`${open ? "flex" : "hidden"} fixed inset-0 z-50 justify-center items-center`}>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 p-5">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agregar nuevo rol</h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleCancel}
                        >
                            <X className="w-5 h-5" />
                            <span className="sr-only">Cerrar modal</span>
                        </button>
                    </div>
                    {/* Modal body */}
                    <form onSubmit={handleAgregar} className="grid gap-4 mb-4 sm:grid-cols-1">
                        <div>
                            <label
                                htmlFor="descripcion"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Descripción
                            </label>
                            <input
                                type="text"
                                id="descripcion"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                {...register("Descripcion", { required: { value: true, message: 'La descripción es requerida' } })}
                            />
                            {errors.Descripcion && <span className="text-red-500">{errors.Descripcion.message}</span>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-primary-600 text-white rounded-lg px-4 py-2 transition duration-300 hover:bg-primary-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster richColors />
        </div>
    );
}
