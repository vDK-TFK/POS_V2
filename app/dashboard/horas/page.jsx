'use client'
import React from 'react';
import useSWR from 'swr';

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al cargar los datos');
    }
    const data = await response.json();
    return data;
};

const Monitorizacion = () => {
    const { data, error } = useSWR(`/api/marcar`, fetcher);

    if (error) return <div>Error al cargar los datos</div>;
    if (!data) return <div>Cargando...</div>;
    if (!Array.isArray(data)) return <div>No hay datos disponibles</div>;

    const asistencias = data.map((asistencia) => ({
        id: asistencia.id,
        nombre: asistencia.empleado?.nombre || 'Desconocido',
        apellido: asistencia.empleado?.apellido || 'Desconocido',
        fecha: new Date(asistencia.fecha).toLocaleDateString(),
        horaEntrada: new Date(asistencia?.entrada).toUTCString().split(' ')[4],
        horaSalida: new Date(asistencia?.salida).toUTCString().split(' ')[4] || 'Aún no ha registrado salida',
        nota: asistencia?.observacion || 'No observaciones en este turno',
    }));
;
    return (
        <div className="max-w-7xl mx-auto py-4">
            <h1 className="text-3xl text-gray-900 dark:text-gray-100 font-semibold mb-2">Monitorización de Horarios</h1>
            <div className="shadow-lg col-span-10 bg-white dark:bg-gray-700 px-5 py-4 rounded-lg">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4"> Nombre</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4"> Apellido</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4"> Día</th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">  Hora de entrada </th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4">  Hora de salida </th>
                                    <th className="text-sm font-semibold text-gray-600 dark:text-gray-400 pb-4"> Notas de empleado </th>
                                </tr>
                            </thead>
                            <tbody>
                                {asistencias.map((asistencia) => (
                                    <tr className="" key={asistencia.id}>                                        
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.nombre}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.apellido}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.fecha}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.horaEntrada}</td>                                    
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.horaSalida}</td>
                                        <td className="text-center text-sm text-gray-900 dark:text-gray-200"> {asistencia.nota}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

        </div>
    );
};

export default Monitorizacion;
