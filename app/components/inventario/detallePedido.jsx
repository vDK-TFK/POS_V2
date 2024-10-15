'use client';

import { X } from 'lucide-react';

export default function DetallePedido({ pedido, onClose }) {
    if (!pedido) return null;

    let productos = [];
    try {
        productos = JSON.parse(pedido.productos) || [];
    } catch (e) {
        console.error("Error al parsear productos:", e);
        productos = [];
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detalle del Pedido</h2>
                    <button onClick={onClose} className="text-gray-900 dark:text-gray-100">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Proveedor</h3>
                        <p className="text-gray-700 dark:text-gray-300">{pedido.proveedores.Nombre}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Estado</h3>
                        <span className={`text-white py-1 px-3 rounded-full ${pedido.estado === 'EN_PROGRESO' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {pedido.estado === 'EN_PROGRESO' ? 'En progreso' : 'Finalizado'}
                        </span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Medio de Pedido</h3>
                        <p className="text-gray-700 dark:text-gray-300">{pedido.medioPedido}</p>
                    </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Productos</h3>
                    <ul className="list-disc list-inside">
                        {productos.length > 0 ? (
                            productos.map((producto, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">{producto.nombre} | Cantidad: {producto.cantidad}</li>
                            ))
                        ) : (
                            <li className="text-gray-700 dark:text-gray-300">No hay productos disponibles</li>
                        )}
                    </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Observaciones</h3>
                    <p className="text-gray-700 dark:text-gray-300">{pedido.observaciones}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fecha de Finalización</h3>
                    <p className="text-gray-700 dark:text-gray-300">{new Date(pedido.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
