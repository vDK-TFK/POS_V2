import React, { useEffect, useState } from 'react';

const EstadoFac = ({ idFactura, estadoFac, mutate }) => {
  const [estado, setEstado] = useState(estadoFac);


  return (
    <span className={getEstadoClass(estado)}>
      {idFactura.toString().padStart(6, '0')}
    </span>
  );
};

function getEstadoClass(estado) {
  switch (estado) {
    case 'ACTIVA':
      return 'bg-green-500 text-white py-2 px-4 rounded-lg';
    case 'PAGADA':
      return 'bg-blue-500 text-white py-2 px-4 rounded-lg';
    case 'CANCELADO':
      return 'bg-gray-500 text-white py-2 px-4 rounded-lg';
    default:
      return 'bg-gray-500 text-white py-2 px-4 rounded-lg';
  }
}

export default EstadoFac;
