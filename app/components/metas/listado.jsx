import React from 'react';

import useSWR, { mutate } from 'swr';

const Listado = ({ AccordionItem, AccordionTrigger, AccordionContent }) => {
    const fetcher = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        return data;
    };
    const { data, error } = useSWR(`/api/metas`, fetcher);

    if (error) return <div>Error al cargar los datos</div>;
    if (!data) return <div>Cargando...</div>;
    if (!Array.isArray(data)) return <div>No hay datos disponibles</div>;

    const evaluaciones = data.map((evaluacion) => ({
        id: evaluacion.id,
        empleado: evaluacion.empleado?.nombre || 'Desconocido',
        fecha: new Date(evaluacion.fecha).toLocaleDateString(),
        observacion: evaluacion.observaciones,
    }));

    return (
        <>
            <AccordionItem value="item-1">
                <AccordionTrigger>En progreso</AccordionTrigger>
                <AccordionContent>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Id</th>
                                <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Proveedor</th>
                                <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Tipo</th>
                                <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluaciones.map((evaluacion) => (
                                <tr className="border-b dark:border-gray-600" key={evaluacion.id}>
                                    <td className="text-sm font-bold text-blue-700 hover:underline py-4">{evaluacion.empleado}</td>
                                    <td className="text-sm text-gray-900 dark:text-gray-200">{evaluacion.fecha}</td>
                                    <td className="text-sm text-gray-900 dark:text-gray-200">{evaluacion.observacion}</td>                                  
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </AccordionContent>
            </AccordionItem>
        </>
    );
};

export default Listado;
