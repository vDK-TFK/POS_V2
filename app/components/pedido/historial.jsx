'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Eliminar from './eliminar';
import DetallePedido from '@/app/components/inventario/detallePedido';
import { Eye } from "lucide-react";

const Historial = () => {
    const { data, error } = useSWR(`/api/pedido`, async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    });

    const [selectedPedido, setSelectedPedido] = useState(null);

    if (error) return <div>Error al cargar los datos</div>;
    if (!data) return <div>Cargando...</div>;
    if (!data || !Array.isArray(data)) return <div>No hay datos disponibles</div>;

    const pedidosFinalizados = data.filter(pedido => pedido.estado === 'FINALIZADO');

    const eliminarPedido = (pedidoId) => {
        // Actualiza los datos después de eliminar un pedido
        mutate(`/api/pedido`, data.filter(pedido => pedido.id !== pedidoId), false);
    };

    return (
        <>
            <fieldset className="mb-[15px] w-full flex flex-col justify-start shadow-lg col-span-10 overflow-x-auto bg-white dark:bg-gray-700 px-5 py-4 rounded-lg">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Id</th>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Proveedor</th>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Tipo</th>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Realizado</th>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Finalizado</th>
                            <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Factura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFinalizados.map((pedido) => (
                            <tr className="border-b dark:border-gray-600" key={pedido.id}>
                                <td className="text-sm font-bold text-blue-700 hover:underline py-4">{pedido.id}</td>
                                <td className="text-sm text-gray-900 dark:text-gray-200">{pedido.proveedores.Nombre}</td>
                                <td className="text-sm text-gray-900 dark:text-gray-200">{pedido.medioPedido}</td>
                                <td className="text-sm text-gray-900 dark:text-gray-200">{new Date(pedido.createdAt).toLocaleDateString()}</td>
                                <td className="text-sm text-gray-900 dark:text-gray-200">{new Date(pedido.updatedAt).toLocaleDateString()}</td>
                                <td className="flex gap-2 my-2">
                                    <button className="p-1.5 text-gray-900 dark:text-gray-200 bg-green-600 bg-opacity-50 rounded-md" onClick={() => setSelectedPedido(pedido)}>
                                        <Eye size={15} strokeWidth={2.2} />
                                    </button>
                                    <Eliminar pedidoId={pedido.id} onEliminar={eliminarPedido} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </fieldset>
            <DetallePedido pedido={selectedPedido} onClose={() => setSelectedPedido(null)} />
        </>
    );
}

export default Historial;
