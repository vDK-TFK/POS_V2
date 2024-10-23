'use client';

import { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import Agregar from "@/app/components/inventario/crearProducto";
import Eliminar from "../../components/inventario/eliminarProducto";
import Editar from "../../components/inventario/editar";
import Ver from "../../components/inventario/ver";
import FiltroMenu from "../../components/buscador/filtros";
import Buscador from "../../components/buscador/buscar";
import Estados from "../../components/inventario/estados";
import { CirclePlus, FileUp, Pencil, Trash, Eye, ClipboardList, Package, Calendar, Filter, Contact, CheckCircle, User, Tag, IdCard } from "lucide-react";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function getExpirationColor(fechaCaducidad) {
  if (!fechaCaducidad) return "gray"; // Si no hay fecha de caducidad, usa gris.

  const hoy = new Date();
  const fecha = new Date(fechaCaducidad);
  const diferenciaDias = Math.floor((fecha - hoy) / (1000 * 60 * 60 * 24));

  if (diferenciaDias > 10) {
    return "green"; // Más de 10 días
  } else if (diferenciaDias >= 0 && diferenciaDias <= 10) {
    return "yellow"; // Menos de 10 días
  } else {
    return "red"; // Fecha pasada
  }
}

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
            <div className="grid grid-cols-4 gap-4">
              {filteredData.map((producto) => (
                <div key={producto.ProductoID} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-2xl">
                  <h2 className="bg-gradient-to-r from-gray-100 to-gray-300 text-center text-lg font-semibold text-gray-800 shadow-md px-5 py-2 rounded-md mb-4 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                    {producto.Nombre}
                  </h2>

                  <div className="flex flex-col space-y-2">
                    <HtmlNewLabel color={"blue"} icon={User} legend={`Proveedor: ${producto.ProveedorID}`} />
                    <HtmlNewLabel color={"blue"} icon={Tag} legend={`Categoría: ${producto.CategoriaID}`} />
                    <HtmlNewLabel color={"green"} icon={Calendar} legend={`Fecha ingreso: ${new Date(producto.FechaIngreso).toLocaleDateString()}`} />
                    <HtmlNewLabel
                      color={getExpirationColor(producto.FechaCaducidad)}
                      icon={Calendar}
                      legend={`Fecha de caducidad: ${producto.FechaCaducidad ? new Date(producto.FechaCaducidad).toLocaleDateString() : 'N/A'}`}
                    />
                    <HtmlNewLabel color={"purple"} icon={Package} legend={`Cantidad: ${producto.Stock}`} />
                  </div>
                  <div className="flex gap-3 justify-center mt-4">
                    <HtmlTableButton
                      color={"blue"}
                      tooltip={"Editar Producto"}
                      icon={Pencil}
                      onClick={() => { setSelectedProductoId(producto.ProductoID); setEditar(true); }}
                    />
                    <HtmlTableButton
                      color={"red"}
                      tooltip={"Eliminar Producto"}
                      icon={Trash}
                      onClick={() => { setSelectedProductoId(producto.ProductoID); setOpen(true); }}
                    />
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
