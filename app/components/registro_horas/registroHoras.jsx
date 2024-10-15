'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Entrada from './horaEntrada';
import Salida from './horaSalida';
import Nota from './observacion';
import MyCalendar from './vistaAsistencia';

import { useCallback } from 'react';

const RegistroHoras = () => {
    const fecha = new Date();
    const horaLocal = fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const mesEsp = meses[fecha.getMonth()];  
    const dia = fecha.getDate();
    const ano = fecha.getFullYear();
    const { data: session, status } = useSession(); 
    const employeeId = session?.user?.id;
    const [asistencia, setAsistencia] = useState(null);
    const [fechas, setFechas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAsistencia = useCallback(async () => {
        if (!employeeId) return; 
        try {
            const response = await fetch(`/api/marcar/${employeeId}`);
            if (!response.ok) {
                toast.info('Aún debe marcar la asistencia de hoy');
                return;
            }            
            const data = await response.json();
            setAsistencia(data);
        } catch (err) {
            toast.error('Error al comunicar con el servidor');
        } finally {
            setLoading(false);
        }
    }, [employeeId]);
    
    const fetchCalendario = useCallback(async () => {
        if (!employeeId) return; 
        try {
            const response = await fetch(`/api/calendario/${employeeId}`);
            if (!response.ok) {
                toast.info('Aún debe marcar la asistencia de hoy');
                return;
            }            
            const data = await response.json();
            setFechas(data);
        } catch (err) {
            toast.error('Error al comunicar con el servidor');
        }
    }, [employeeId]);
    
    
    useEffect(() => {
        fetchAsistencia();
        fetchCalendario();
    }, [fetchAsistencia, fetchCalendario]);

    useEffect(() => {
        if (asistencia) {
            setLoading(false);
        }
    }, [asistencia]);

    const horaEntrada = new Date(asistencia?.entrada).toUTCString().split(' ')[4];
    const horaSalida = new Date(asistencia?.salida).toUTCString().split(' ')[4];

    return (
        <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Registro Horas Entrada/Salida {dia} de {mesEsp} del {ano}</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="shadow-lg bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Hora de entrada</h2>
                    <div>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : asistencia ? (
                            <p>{horaEntrada}</p>
                        ) : (
                            <Entrada actual={horaLocal} usuarioId={employeeId} onAsistencia={fetchAsistencia} />
                        )}
                    </div>
                </div>
                <div className="shadow-lg bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Hora de salida</h2>
                    <div>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : asistencia?.entrada ? (
                            asistencia?.salida ? (
                                <p>{horaSalida}</p>
                            ) : (
                                <Salida actual={horaLocal} asistenciaId={asistencia?.id} onAsistencia={fetchAsistencia} onCalendario={fetchCalendario} />
                            )
                        ) : (
                            <p>Primero debe registrar su hora de entrada</p>
                        )}
                    </div>          
                </div>
                <div className="shadow-lg bg-white dark:bg-gray-700 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Agregar observación</h2>
                    <div>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : asistencia?.entrada ? (
                            asistencia?.salida ? (
                                <p>Su horario de trabajo finalizó</p>
                            ) : (
                                <Nota actual={horaLocal} asistenciaId={asistencia?.id} onAsistencia={fetchAsistencia} />
                            )
                        ) : (
                            <p>Primero debe registrar su hora de entrada</p>
                        )}
                    </div>          
                </div>
            </div>
            <div className='pt-4'>
                <MyCalendar fechas={fechas} />                
            </div>
            <Toaster richColors />
        </div>
    );
};

export default RegistroHoras;
