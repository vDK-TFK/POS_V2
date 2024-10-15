'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { X, Eye } from 'lucide-react';
import DetallePedido from './DetallePedido'; // Importa el nuevo componente

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Pedidos({ open, onClose }) {
  const { data, error } = useSWR(open ? '/api/pedido' : null, fetcher);
  const [selectedPedido, setSelectedPedido] = useState(null);

  if (!open) return null;
  if (error) return <div>Error al cargar los pedidos</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pedidos</h2>
            <button onClick={onClose} className="text-gray-900 dark:text-gray-100">
              <X size={24} />
            </button>
          </div>
          <ul className="space-y-4">
            {data.map((pedido) => (
              <li key={pedido.id} className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{pedido.id}</span>
                  <span className="text-gray-900 dark:text-gray-100">{pedido.proveedor}</span>
                  <span className={`text-white py-1 px-3 rounded-full ${pedido.estado === 'EN_PROGRESO' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {pedido.estado === 'EN_PROGRESO' ? 'En progreso' : 'Finalizado'}
                  </span>
                  <button className="p-1.5 text-gray-900 dark:text-gray-200 bg-green-600 bg-opacity-50 rounded-md" onClick={() => setSelectedPedido(pedido)}>
                    <Eye size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DetallePedido pedido={selectedPedido} onClose={() => setSelectedPedido(null)} />
    </>
  );
}
