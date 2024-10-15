import { X, CircleAlert } from "lucide-react";
import { Toaster, toast } from 'sonner';

export default function Ver({ open, onClose }) {
    const handleVer = () => {
        toast.success('Acción realizada con éxito');
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    // Aquí puedes reemplazar los datos de ejemplo con los datos reales del cliente
    const cliente = {
        nombre: "Josué",
        apellidos: "Bonilla Soto",
        cedula: "305440618",
        correo: "josue@gmail.com",
        telefono: "72094668",
        descripcion: "San José, Costa Rica",
        facturasAsignadas: [
            { id: '00001', monto: 1000, fecha: "2024-03-01" },
            { id: '00020', monto: 1500, fecha: "2024-03-15" },
            { id: '00030', monto: 2000, fecha: "2024-03-30" }
        ]
    };

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0  justify-center items-center grid grid-cols-8 transition-opacity ${open ? "visible bg-black bg-opacity-20" : "invisible"}`}>
                <div onClick={(e) => e.stopPropagation()} className={` bg-white rounded-xl shadow p-6 transition-all col-span-4 col-start-3 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">
                        <X />
                    </button>
                    <div className="w-full">
                        <div className="mx-5 my-4 w-full">
                            <h2 className="text-2xl font-bold flex gap-3 text-center text-gray-900">Ver cliente</h2>
                            <hr className="my-3 mr-7 py-0.2 border border-black" />
                        </div>
                        <div className="ml-5 my-4 w-full">
                            <dl className="grid grid-cols-2 gap-x-4">
                                <div className="mb-4">
                                    <dt className="text-sm font-medium text-gray-700">Nombre</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.nombre}</dd>
                                </div>
                                <div className="mb-4">
                                    <dt className="text-sm font-medium text-gray-700">Apellidos</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.apellidos}</dd>
                                </div>
                                <div className="mb-4">
                                    <dt className="text-sm font-medium text-gray-700">Cedula</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.cedula}</dd>
                                </div>
                                <div className="mb-4">
                                    <dt className="text-sm font-medium text-gray-700">Correo</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.correo}</dd>
                                </div>
                                <div className="mb-4">
                                    <dt className="text-sm font-medium text-gray-700">Telefono</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.telefono}</dd>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <dt className="text-sm font-medium text-gray-700">Dirección</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{cliente.descripcion}</dd>
                                </div>
                                <div className="mb-4 col-span-2">
                                    <dt className="text-sm font-medium text-gray-700">Facturas</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {cliente.facturasAsignadas.map((factura) => (
                                            <div key={factura.id}>
                                                ID: {factura.id}, Monto: {factura.monto}, Fecha: {factura.fecha}
                                            </div>
                                        ))}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div className="flex justify-end gap-4 mr-5">
                            <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6" onClick={onClose}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster richColors />
        </>
    );
}
