'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import AgregarProducto from "@/app/components/inventario/crearProducto";
import EliminarProducto from "@/app/components/inventario/eliminarProducto";
import EditarProducto from "@/app/components/inventario/editar";
import PageContent from "@/app/components/HtmlHelpers/PageContent";
import TablePagination from "@/app/components/HtmlHelpers/Pagination";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import Buscador from "../../components/buscador/buscar";
import FiltroMenu from "../../components/buscador/filtros";
import { Plus, Download, Pencil, Trash, Calendar, Package, Tag, User, Filter } from "lucide-react";
import { toast } from 'sonner';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());
const itemsBreadCrumb = ["Dashboard", "Inventario"];

function getExpirationColor(fechaCaducidad) {
  if (!fechaCaducidad) return "gray";

  const hoy = new Date();
  const fecha = new Date(fechaCaducidad);
  const diferenciaDias = Math.floor((fecha - hoy) / (1000 * 60 * 60 * 24));

  if (diferenciaDias > 10) return "green";
  if (diferenciaDias >= 0 && diferenciaDias <= 10) return "yellow";
  return "red";
}

export default function Inventario() {
  const [onLoading, setOnLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina] = useState(8); // Número de registros por página
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [filtros, setFiltros] = useState({
    filterCategoria: '',
    filterEstado: '',
    filterProveedor: ''
  });
  const fetchCalled = useRef(false);

  // Función para obtener la lista de inventario
  const onGet_ListaInventario = useCallback(async () => {
    if (fetchCalled.current) return; // Prevenir múltiples llamadas
    fetchCalled.current = true; // Marcar que ya fue llamado

    setOnLoading(true);
    try {
      const response = await fetch(`/api/inventario`);
      const result = await response.json();
      if (result.status === "success") {
        setProductos(result.data || []);
        toast.success("Inventario cargado exitosamente");
      } else if (result.code === 204) {
        toast.warning("No se encontraron registros en el inventario");
        setProductos([]);
      } else {
        console.error("Error en la respuesta:", result.message);
        toast.error("Error al obtener el inventario");
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setOnLoading(false);
    }
  }, []);

  const filterButtonRef = useRef(null);
  const menuRef = useRef(null);

  const { data, error, mutate } = useSWR(`/api/inventario`, fetcher, {
    onSuccess: (response) => {
      if (response.status === "success") {
        setProductos(response.data || []);
      } else {
        toast.warning("No se encontraron productos.");
      }
      setOnLoading(false);
    },
    onError: () => {
      toast.error("Error al cargar los datos del inventario.");
      setOnLoading(false);
    },
  });


  useEffect(() => {
    onGet_ListaInventario();
  }, [onGet_ListaInventario]);

  const handleReload = () => {
    fetch('/api/inventario')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setProductos(data.data || []);
          toast.success('Productos actualizados correctamente.');
        }
      })
      .catch(() => {
        toast.error('Error al actualizar productos.');
      });
  };


  const handleSearch = (term) => setSearchTerm(term);
  const handleFilterChange = (newFilters) => setFiltros(newFilters);

  // Filtro y paginación
  const filteredData = Array.isArray(productos)
    ? productos.filter((producto) => {
      const matchesSearch =
        producto.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.ProductoID?.toString().includes(searchTerm);
      const matchesCategoria = filtros.filterCategoria
        ? producto.CategoriaID === Number(filtros.filterCategoria)
        : true;
      const matchesEstado = filtros.filterEstado
        ? producto.Estado === filtros.filterEstado
        : true;
      const matchesProveedor = filtros.filterProveedor
        ? producto.ProveedorID === Number(filtros.filterProveedor)
        : true;
      return matchesSearch && matchesCategoria && matchesEstado && matchesProveedor;
    })
    : [];

  const indexOfLastProducto = paginaActual * registrosPorPagina;
  const indexOfFirstProducto = indexOfLastProducto - registrosPorPagina;
  const currentProductos = filteredData.slice(indexOfFirstProducto, indexOfLastProducto);

  const handleExport = () => {
    if (!productos.length) {
      toast.warning("No hay datos para exportar.");
      return;
    }
    generateExcelReport(productos);
  };

  const generateExcelReport = (data) => {
    const formattedData = data.map(producto => ({
      "ID Producto": producto.ProductoID,
      "Nombre": producto.Nombre,
      "Proveedor": producto.NombreProveedor || "N/A",
      "Categoría": producto.NombreCategoria || "N/A",
      "Cantidad": producto.Stock,
      "Fecha Ingreso": producto.FechaIngreso ? new Date(producto.FechaIngreso).toLocaleDateString() : "N/A",
      "Fecha Caducidad": producto.FechaCaducidad ? new Date(producto.FechaCaducidad).toLocaleDateString() : "N/A",
      "Estado": producto.Estado
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = "Inventario.xlsx";
    downloadLink.click();
  };

  const pageContent = (
    <>
      {/* Controles superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Buscador onSearch={handleSearch} />
        <HtmlButton color="blue" icon={Plus} legend="Agregar" onClick={() => setModalAgregar(true)} />
        <HtmlButton color="green" icon={Download} legend="Exportar" onClick={handleExport} />
      </div>

      {/* Cards de productos */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProductos.map((producto) => (
          <div
            key={producto.ProductoID}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {producto.Nombre}
              </h2>
              <div className="space-y-2">
                <HtmlNewLabel color="blue" icon={User} legend={`Proveedor: ${producto.NombreProveedor || "N/A"}`} />
                <HtmlNewLabel color="blue" icon={Tag} legend={`Categoría: ${producto.NombreCategoria || "N/A"}`} />
                <HtmlNewLabel
                  color="green"
                  icon={Calendar}
                  legend={`Fecha ingreso: ${producto.FechaIngreso ? new Date(producto.FechaIngreso).toLocaleDateString() : "N/A"}`}
                />
                <HtmlNewLabel
                  color={getExpirationColor(producto.FechaCaducidad)}
                  icon={Calendar}
                  legend={`Fecha caducidad: ${producto.FechaCaducidad ? new Date(producto.FechaCaducidad).toLocaleDateString() : "N/A"}`}
                />
                <HtmlNewLabel color="purple" icon={Package} legend={`Cantidad: ${producto.Stock}`} />
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <HtmlTableButton
                color="blue"
                tooltip="Editar"
                icon={Pencil}
                onClick={() => {
                  setSelectedProducto(producto);
                  setModalEditar(true);
                }}
              />
              <HtmlTableButton
                color="red"
                tooltip="Eliminar"
                icon={Trash}
                onClick={() => {
                  setSelectedProducto(producto);
                  setModalEliminar(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <TablePagination
        listado={filteredData}
        paginaActual={paginaActual}
        registrosPorPagina={registrosPorPagina}
        onSet_PaginaActual={setPaginaActual}
      />

      {/* Modales */}
      <AgregarProducto open={modalAgregar} onClose={() => setModalAgregar(false)} onReload={handleReload} />
      <EditarProducto open={modalEditar} productoId={selectedProducto?.ProductoID} onClose={() => setModalEditar(false)} onReload={handleReload} />
      <EliminarProducto open={modalEliminar} productoId={selectedProducto?.ProductoID} onClose={() => setModalEliminar(false)} onReload={handleReload} />
    </>
  );


  return <PageContent itemsBreadCrumb={itemsBreadCrumb} content={pageContent} tituloCard="Gestión de Inventario" />;
}
