import { useEffect, useState, useCallback } from 'react';

const FiltroMenu = ({ onFilterChange }) => {
  const [filterEstado, setFilterEstado] = useState('');

  // Use useCallback to memoize onFilterChange if it changes too often
  const memoizedOnFilterChange = useCallback(
    (filter) => onFilterChange(filter),
    [onFilterChange]
  );

  useEffect(() => {
    memoizedOnFilterChange({ filterEstado });
  }, [filterEstado, memoizedOnFilterChange]); // Agrega memoizedOnFilterChange a las dependencias

  return (
    <div className="absolute top-16 right-16 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-72">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filtros</h3>
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-300">Estado</label>
        <select
          onChange={(e) => setFilterEstado(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Todos</option>
          <option value="Vigente">Vigente</option>
          <option value="Por caducar">Por caducar</option>
          <option value="Caducado">Caducado</option>
          <option value="Fresco">Fresco</option>
        </select>
      </div>
    </div>
  );
};

export default FiltroMenu;
