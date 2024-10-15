'use client';

import { useEffect, useState } from 'react';
import Editar from "@/app/components/facturas/editar";
import Ver from "@/app/components/facturas/ver";
import Buscador from "../../components/buscador/buscar";

const obtenerFechaEnEspanol = (fecha) => {
  const date = new Date(fecha);
  const opciones = {
    weekday: 'short', 
    day: '2-digit', 
    month: 'long', 
  };

  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(date);
  const año = date.getFullYear(); 

  return `${fechaFormateada} del ${año}`;
};

const agruparProductos = (detalles) => {
  const productosAgregados = detalles.reduce((acc, producto) => {
    const descripcion = producto.descripcion;
    const cantidad = parseFloat(producto.cantidad); 

    if (acc[descripcion]) {
      acc[descripcion].cantidad += cantidad;
    } else {
      acc[descripcion] = { ...producto, cantidad }; 
    }
    return acc;
  }, {});

  return Object.values(productosAgregados);
};

export default function Inventario() {
  const [filtros, setFiltros] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/factura`);
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []); // Solo se ejecuta al montar el componente

  useEffect(() => {
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [error]);

  if (error) return <div className="text-red-500">Error al cargar los datos</div>;
  if (!data.length) return <div>Cargando...</div>;

  const filteredData = Array.isArray(data) ? data.filter(factura => {
    const nombreCliente = factura.cliente.nombre.toLowerCase() + factura.cliente.apellido.toLowerCase();
    const facturaId = factura.idFactura.toString().padStart(6, '0');
    const searchLower = searchTerm.toLowerCase();
  const filteredData = Array.isArray(data) ? data.filter(factura => {
    const nombreCliente = factura.cliente.nombre.toLowerCase() + factura.cliente.apellido.toLowerCase();
    const facturaId = factura.idFactura.toString().padStart(6, '0');
    const searchLower = searchTerm.toLowerCase();

    return (nombreCliente.includes(searchLower) || facturaId.includes(searchTerm)) &&
      (filtros === '' || 
        (filtros === 'activa' && factura.estadoFac === 'ACTIVA') ||
        (filtros === 'pagada' && factura.estadoFac === 'PAGADA') ||
        (filtros === 'nula' && factura.estadoFac === 'NULA'));
  }) : [];
    return (nombreCliente.includes(searchLower) || facturaId.includes(searchTerm)) &&
      (filtros === '' || 
        (filtros === 'activa' && factura.estadoFac === 'ACTIVA') ||
        (filtros === 'pagada' && factura.estadoFac === 'PAGADA') ||
        (filtros === 'nula' && factura.estadoFac === 'NULA'));
  }) : [];

  const handleVerMasClick = (factura) => {
    setFacturaSeleccionada(factura);
  };

  const handleCloseModal = () => {
    setFacturaSeleccionada(null);
  };

  const handleActualizarEstado = (nuevoEstado) => {
    if (facturaSeleccionada) {
      actualizarEstadoFactura(facturaSeleccionada.idFactura, nuevoEstado);
    }
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getMedioPagoTexto = (idMedioPago) => {
    switch (idMedioPago) {
      case 1:
        return "Efectivo";
      case 2:
        return "Tarjeta";
      case 3:
        return "Transferencia / Sinpe";
      default:
        return "Desconocido";
    }
  };
  
  return (
    <div className="w-full relative">
      <div className="md:grid gap-4 max-w-7xl mx-auto py-4 md:w-auto flex flex-col md:grid-cols-10 mb-3 md:mb-0 items-stretch md:items-center">
        <h1 className="font-semibold col-span-10 text-3xl text-gray-900 dark:text-gray-100">Facturas</h1>

        <div className="col-span-3 flex items-center relative">
          {[
            { key: '', label: 'Todas', color: 'gray-700', hoverColor: 'gray-600' },
            { key: 'activa', label: 'Pendientes', color: 'green-500', hoverColor: 'green-600' },
            { key: 'pagada', label: 'Pagadas', color: 'blue-500', hoverColor: 'blue-600' },
            { key: 'nula', label: 'Nulas', color: 'gray-500', hoverColor: 'gray-600' },
          ].map(({ key, label, color, hoverColor }) => (
            <div
              key={key}
              className={`cursor-pointer text-sm font-semibold px-2 py-1 border-b-2 ${filtros === key ? `border-${color} text-${color}` : `border-transparent text-gray-600 dark:text-gray-300`} hover:border-${hoverColor} hover:text-${hoverColor}`}
              onClick={() => setFiltros(key)}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="col-span-7 flex justify-end mb-4 md:mb-0">
          <Buscador onSearch={handleSearch} />
        </div>

        <div className="shadow-lg col-span-10 overflow-x-auto bg-white dark:bg-gray-700 px-5 py-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredData.map((factura) => {
              const productosAgrupados = agruparProductos(factura.detalles);
              return (
                <div key={factura.idFactura} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <span className='flex gap-2 text-center'>
                    <span className='flex flex-col gap-2 text-center'>
                      <p className="bg-yellow-200 font-semibold text-black py-2 px-4 rounded-lg">
                        {factura.idFactura.toString().padStart(6, '0')}
                      </p>
                      <Editar estadoActual={factura.estadoFac} onActualizarEstado={handleActualizarEstado} facturaId={factura.idFactura} />
                    </span>
                    <span className='flex flex-col items-start'>
                      <p className="text-md font-semibold text-gray-900 dark:text-gray-400">
                      {factura.cliente.nombre} {factura.cliente.apellido}
                      </p>
                      <p className="text-sm font-normal text-gray-900 dark:text-gray-400">
                      {obtenerFechaEnEspanol(factura.fechaEmision)}
                      </p>
                      <p className="text-md font-normal text-gray-900 dark:text-gray-400">
                      Pago con: {getMedioPagoTexto(factura.idMedioPago)}
                      </p>
                    </span>
                  </span>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Precio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {productosAgrupados.slice(0, 4).map((producto) => (
                          <tr key={producto.idDetalleFactura}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {producto.descripcion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {producto.cantidad}
                            </td>
                            <td className="px-6 text-end py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {producto.precio}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                   

                    {productosAgrupados.length > 4 && (
                      <button
                        onClick={() => handleVerMasClick(factura)}
                        className="mt-4 text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        Ver más...
                      </button>
                    )}
                    
                  </div>
                  <p className="text-md font-bold text-end text-gray-900 dark:text-gray-400">Total: ₡ {factura.total}</p>
                 
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {facturaSeleccionada && (
        <Ver 
          open={!!facturaSeleccionada} 
          factura={facturaSeleccionada} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}