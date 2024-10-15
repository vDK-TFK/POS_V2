'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function HorarioModal({ open, onClose, mutate, employeeId }) {
  const initialHorario = {
    lunes: { inicio: '', fin: '', es_dia_libre: false },
    martes: { inicio: '', fin: '', es_dia_libre: false },
    miércoles: { inicio: '', fin: '', es_dia_libre: false },
    jueves: { inicio: '', fin: '', es_dia_libre: false },
    viernes: { inicio: '', fin: '', es_dia_libre: false },
    sábado: { inicio: '', fin: '', es_dia_libre: false },
    domingo: { inicio: '', fin: '', es_dia_libre: false }
  };

  const [horario, setHorario] = useState(initialHorario);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (dia, tipo, valor) => {
    setHorario(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: valor
      }
    }));
  };

  const handleDiaLibreChange = (dia) => {
    setHorario(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        es_dia_libre: !prev[dia].es_dia_libre,
        inicio: '', // Limpiar horas cuando se marca como día libre
        fin: ''
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(horario).forEach(dia => {
      const { inicio, fin, es_dia_libre } = horario[dia];
      if (!es_dia_libre) {
        if (!inicio) newErrors[`${dia}_inicio`] = 'La hora de inicio es requerida';
        if (!fin) newErrors[`${dia}_fin`] = 'La hora de fin es requerida';
        if (inicio && fin && inicio >= fin) newErrors[`${dia}_horario`] = 'La hora de inicio debe ser menor que la hora de fin';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    if (!employeeId) {
      toast.error('ID de empleado no proporcionado');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/horario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId: employeeId, // Pasar el ID del empleado aquí
          horarios: Object.keys(horario).map(dia => ({
            Dia: dia,
            HoraInicio: horario[dia].inicio,
            HoraFin: horario[dia].fin,
            esDiaLibre: horario[dia].es_dia_libre
          }))
        })
      });

      if (response.ok) {
        toast.success('Horario guardado exitosamente');
        mutate();  
        resetForm(); // Restablece el estado después de guardar
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('Error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHorario(initialHorario);
    setErrors({});
    setLoading(false);
  };

  const handleCancel = () => {
    resetForm(); // Restablece el estado cuando se cancela
    onClose();
  };

  if (!open) return null;

  return (
    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-20 dark:bg-opacity-30" : "invisible"}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} m-auto`}>
        <button onClick={handleCancel} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100 my-4">
            Asignar horario
          </h2>
          <hr className="w-full border-t border-gray-300 dark:border-gray-600"></hr>

          <form onSubmit={handleSubmit}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día Libre</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(horario).map(dia => (
                  <tr key={dia}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{dia}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="time"
                        value={horario[dia].inicio}
                        onChange={(e) => handleChange(dia, 'inicio', e.target.value)}
                        disabled={horario[dia].es_dia_libre}
                        className="p-2 border rounded-md"
                      />
                      {errors[`${dia}_inicio`] && <span className="text-red-500 text-sm">{errors[`${dia}_inicio`]}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="time"
                        value={horario[dia].fin}
                        onChange={(e) => handleChange(dia, 'fin', e.target.value)}
                        disabled={horario[dia].es_dia_libre}
                        className="p-2 border rounded-md"
                      />
                      {errors[`${dia}_fin`] && <span className="text-red-500 text-sm">{errors[`${dia}_fin`]}</span>}
                      {errors[`${dia}_horario`] && <span className="text-red-500 text-sm">{errors[`${dia}_horario`]}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="checkbox"
                        checked={horario[dia].es_dia_libre}
                        onChange={() => handleDiaLibreChange(dia)}
                        className="form-checkbox h-4 w-4"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-4 mt-5">
              <button type="submit" className={`bg-green-500 font-semibold rounded-md py-2 px-6 text-white ${loading ? 'cursor-wait' : ''}`} disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar'}
              </button>
              <button type="button" className="bg-gray-400 font-semibold rounded-md py-2 px-6 text-white" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
