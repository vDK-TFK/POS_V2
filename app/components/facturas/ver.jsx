import React from 'react';

// Función para agrupar productos y sumar cantidades
const agruparProductos = (detalles) => {
  const productosAgregados = detalles.reduce((acc, producto) => {
    const descripcion = producto.descripcion;
    const cantidad = parseFloat(producto.cantidad); // Asegúrate de convertir a número

    if (acc[descripcion]) {
      acc[descripcion].cantidad += cantidad;
    } else {
      acc[descripcion] = { ...producto, cantidad }; // Inicializa con cantidad como número
    }
    return acc;
  }, {});

  return Object.values(productosAgregados);
};

const Ver = ({ open, factura, onClose }) => {
  if (!open || !factura) return null;

  // Agrupamos los productos aquí
  const productosAgrupados = agruparProductos(factura.detalles);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-11/12 max-w-md max-h-[80vh] overflow-auto relative">
        <button 
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Todos los productos</h2>
        <div className="overflow-y-auto">
          <table className="table-auto border-collapse text-md divide-gray-200 dark:divide-gray-700 w-full">
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
              {productosAgrupados.map((producto, index) => (
                <tr key={index}>
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
          <p className="text-md font-bold text-end text-gray-900 dark:text-gray-400 mt-4">Total: ₡ {factura.total}</p>
        </div>
      </div>
    </div>
  );
};

export default Ver;
