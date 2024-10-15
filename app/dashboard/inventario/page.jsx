'use client';

import { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Agregar from "@/app/components/inventario/crearProducto";
import Eliminar from "../../components/inventario/eliminarProducto";
import Editar from "../../components/inventario/editar";
import Ver from "../../components/inventario/ver";
import FiltroMenu from "../../components/buscador/filtros";
import Buscador from "../../components/buscador/buscar";
import Estados from "../../components/inventario/estados";
import { CirclePlus, FileUp, Pencil, Trash, Eye, ClipboardList, Filter } from "lucide-react";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Inventario() {
  const [open, setOpen] = useState(false);
  const [agregar, setAgregar] = useState(false);
  const [ver, setVer] = useState(false);
  const [editar, setEditar] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    filterCategoria: '',
    filterEstado: '',
    filterProveedor: ''
  });

  const filterButtonRef = useRef(null);
  const menuRef = useRef(null);

  const { data, error, mutate } = useSWR(`/api/inventario`, fetcher);

  useEffect(() => {
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [error]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFiltros(newFilters);
  };

  const handleExport = () => {
    if (typeof document !== 'undefined') {
      generateExcelReport(filteredData);
    }
  };

  const generateExcelReport = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = "inventario.xlsx";
    downloadLink.click();
  };

  const filteredData = data ? data.filter(producto =>
    (producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.ProductoID.toString().includes(searchTerm)) &&
    (filtros.filterCategoria ? producto.CategoriaID === filtros.filterCategoria : true) &&
    (filtros.filterEstado ? producto.Estado === filtros.filterEstado : true) &&
    (filtros.filterProveedor ? producto.ProveedorID === filtros.filterProveedor : true)
  ) : [];

  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) && filterButtonRef.current && !filterButtonRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  if (error) return <div>Error al cargar los datos</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <>
      <div className="w-full relative">
        <div className="md:grid gap-4 max-w-7xl mx-auto py-4 md:w-auto flex flex-col md:grid-cols-10 mb-3 md:mb-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <h1 className="font-semibold col-span-10 text-3xl text-gray-900 dark:text-gray-100">Inventario</h1>
          <div className="col-span-3 flex items-center relative">
            <Buscador onSearch={handleSearch} />
            <button ref={filterButtonRef} onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2 p-2 t-0 rounded-md bg-gray-200 dark:bg-gray-700">
              <Filter className="text-gray-900 dark:text-gray-100" />
            </button>
          </div>
          <div className="col-start-8 space-x-4 col-span-3">
            <div className="sm:w-auto flex gap-4 flex-row mb-3 md:mb-0 md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button className="flex items-center gap-3 shadow-lg active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform text-white font-semibold bg-green-500 dark:bg-green-600 px-4 py-2 rounded-lg" onClick={() => setAgregar(true)}>
                <CirclePlus className="text-white" />
                Agregar
              </button>
              <button onClick={handleExport} className="flex gap-3 shadow-lg text-green-500 dark:text-green-400 font-semibold bg-white dark:bg-gray-700 px-4 py-2 active:scale-95 transition-transform ease-in-out duration-75 hover:scale-105 transform border border-green-500 dark:border-green-400 rounded-lg">
                <FileUp className="text-green-500 dark:text-green-400" />
                Exportar
              </button>
            </div>
          </div>
          <div className="shadow-lg col-span-10 overflow-x-auto bg-white dark:bg-gray-700 px-5 py-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredData.map((producto) => (
                <div key={producto.ProductoID} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="bg-gray-300 dark:bg-gray-900 text-lg font-bold text-gray-900 dark:text-gray-100 px-2 rounded-r-lg rounded-l-lg">{producto.Nombre}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {producto.ProductoID}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado: <Estados fechaCaducidad={producto.FechaCaducidad} productoId={producto.ProductoID} mutate={mutate} /></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Proveedor: {producto.ProveedorID}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {producto.Stock}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha ingreso: {new Date(producto.FechaIngreso).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de caducidad: {producto.FechaCaducidad ? new Date(producto.FechaCaducidad).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categoría: {producto.CategoriaID}</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <button className="p-1.5 text-gray-900 dark:text-gray-200 bg-blue-600 bg-opacity-50 rounded-md" onClick={() => {
                      setSelectedProductoId(producto.ProductoID);
                      setEditar(true);
                    }}><Pencil size={15} strokeWidth={2.2} /></button>
                    <button className="p-1.5 text-gray-900 dark:text-gray-200 bg-green-600 bg-opacity-50 rounded-md" onClick={() => {
                      setSelectedProductoId(producto.ProductoID);
                      setVer(true);
                    }}><Eye size={15} strokeWidth={2.2} /></button>
                    <button className="p-1.5 text-gray-900 dark:text-gray-200 bg-red-600 bg-opacity-50 rounded-md" onClick={() => {
                      setSelectedProductoId(producto.ProductoID);
                      setOpen(true);
                    }}><Trash size={15} strokeWidth={2.2} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Eliminar open={open} onClose={() => setOpen(false)} productoId={selectedProductoId} mutate={mutate} />
        <Agregar open={agregar} onClose={() => setAgregar(false)} mutate={mutate} />
        <Editar open={editar} onClose={() => setEditar(false)} productoId={selectedProductoId} mutate={mutate} />
        <Ver open={ver} onClose={() => setVer(false)} productoId={selectedProductoId} />
        {isMenuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: filterButtonRef.current ? filterButtonRef.current.getBoundingClientRect().bottom + window.scrollY - 50 : 0,
              left: filterButtonRef.current ? filterButtonRef.current.getBoundingClientRect().left + window.scrollX + 50 : 20
            }}
          >
            <FiltroMenu onFilterChange={handleFilterChange} />
          </div>
        )}
      </div>
    </>
  );
}
