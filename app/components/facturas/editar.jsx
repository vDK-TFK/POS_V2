import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { mutate } from 'swr';

const estadoMap = {
  ACTIVA: 'Pendiente',
  PAGADA: 'Pagada',
  NULA: 'Nula',
};

const estadoReverseMap = {
  Pendiente: 'ACTIVA',
  Pagada: 'PAGADA',
  Nula: 'NULA',
};

const Editar = ({ estadoActual, onActualizarEstado, facturaId }) => {
  const [selectedOption, setSelectedOption] = useState(estadoMap[estadoActual] || 'Seleccionar estado');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedOption(estadoMap[estadoActual] || 'Seleccionar estado');
  }, [estadoActual]);

  const handleOptionChange = async (event) => {
    const newEstado = event.target.value;
    setSelectedOption(newEstado);
    
    // Actualizar el estado en la base de datos
    try {
      const response = await fetch(`/api/factura/${facturaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estadoFac: estadoReverseMap[newEstado] }), // Enviar estado en mayúsculas
      });

      if (response.ok) {
        const facturaActualizada = await response.json();
        toast.success('Factura actualizada con éxito');
        onActualizarEstado(estadoReverseMap[newEstado]); // Actualizar estado en el componente padre

      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('Error al actualizar la factura');
    }

    setIsOpen(false);
  };

  const getButtonColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-green-500';
      case 'Pagada':
        return 'bg-blue-500';
      case 'Nula':
        return 'bg-gray-500';
      default:
        return 'bg-gray-200';
    }
  };

  const [buttonColor, setButtonColor] = useState(getButtonColor(selectedOption));

  useEffect(() => {
    setButtonColor(getButtonColor(selectedOption));
  }, [selectedOption]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-white flex px-4 py-1 rounded focus:outline-none items-center ${buttonColor}`}
      >
        {selectedOption} <ChevronDown size={20} />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-2">
            {['Pendiente', 'Pagada', 'Nula'].map((estado) => (
              <div key={estado} className="flex items-center mt-2">
                <input
                  type="radio"
                  id={`option-${estado}`}
                  name="dropdown-option"
                  value={estado}
                  checked={selectedOption === estado}
                  onChange={handleOptionChange}
                  className="mr-2"
                />
                <label htmlFor={`option-${estado}`}>{estado}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editar;
