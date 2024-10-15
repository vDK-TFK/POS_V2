import React, { useEffect } from 'react';
import { ESTADOS } from './estadosConfig';

const Estados = ({ fechaCaducidad, productoId, mutate }) => {
  const calcularEstado = (fecha) => {
    const hoy = new Date();
    const fechaCaducidadDate = new Date(fecha);
    const diferenciaDias = Math.ceil((fechaCaducidadDate - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias > 10) {
      return ESTADOS[0]; 
    } else if (diferenciaDias <= 10 && diferenciaDias >= 0) {
      return ESTADOS[1]; 
    } else {
      return ESTADOS[2]; 
    }
  };

  const estado = calcularEstado(fechaCaducidad);

  useEffect(() => {
    const actualizarEstadoEnBD = async () => {
      try {
        const response = await fetch(`/api/inventario/${productoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Estado: estado }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.success('Estado actualizado con éxito');
          console.log('Estado actualizado en la base de datos:', data);
          mutate();
        } else {
          const errorData = await response.json();
          throw new Error(`Error al actualizar el estado en la base de datos: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error al actualizar el estado en la base de datos:', error);
      }
    };

    if (productoId && !isNaN(productoId)) {
      actualizarEstadoEnBD();
    }
  }, [estado, productoId, mutate]);

  return <span className={getEstadoClass(estado)}>{estado}</span>;
};

function getEstadoClass(estado) {
  switch (estado) {
    case 'Vigente':
      return 'bg-green-500 text-white font-semibold px-2 py-0 rounded-r-lg rounded-l-lg';
    case 'Por caducar':
      return 'bg-yellow-500 text-white font-semibold px-2 py-0 rounded-r-lg rounded-l-lg';
    case 'Caducado':
      return 'bg-red-500 text-white font-semibold px-2 py-0 rounded-r-lg rounded-l-lg';
    default:
      return 'bg-gray-500 text-white font-semibold px-2 py-0 rounded-r-lg rounded-l-lg';
  }
}

export default Estados;
