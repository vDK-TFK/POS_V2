'use client'
import { AddRemoveClassById, FormatName } from "@/app/api/utils/js-helpers";
import IniciarCaja from "@/app/components/caja/iniciarCaja";
import MultipleSelectCliente from "@/app/components/clientes/multipleSelectCliente";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import AgregarCLientePos from "@/app/components/pos/agregarClientePos";
import IngresarInfoEmpresa from "@/app/components/pos/agregarInfoEmpresa";
import AgregarProductoVenta from "@/app/components/pos/agregarProdVenta";
import CartaComida from "@/app/components/pos/cartaComida";
import ModalRegistrarPago from "@/app/components/pos/modalPago";
import PrintTicket from "@/app/components/pos/printTicket";
import { CoinsIcon, HandPlatter, Trash } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from 'sonner';

export default function App() {
  const itemsBreadCrumb = ["Home", "POS"];
  const fechaActual = new Date().toLocaleDateString();
  const [modalAgregar, openModalAgregar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [catalogoCategoria, setCatalogoCategorias] = useState([]);
  const [listadoProductos, setListadoProductos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [nombreCliente, setNombreCliente] = useState('');
  const [modalMultipleClientes, onModal_MultiplesClientes] = useState(false);
  const [listaMultiplesClientes, setListaMultiplesClientes] = useState([]);
  const [modalRegistrarPago, onModal_RegistrarPago] = useState(false);
  const [modelFactura, setModelFactura] = useState(null);
  const [modelReceptor, setModelReceptor] = useState(null);
  const [modalAgregarClientePos, onModal_AgregarClientePos] = useState(false);
  const [infoEmpresa, onSet_InfoEmpresa] = useState(null);
  const [modalPrint, onModal_Print] = useState(false);
  const [objectImpresion, onSet_ObjectImpresion] = useState(null);
  const [modalIniciarCaja, onModal_IniciarCaja] = useState(null);
  const [existeCajaAbierta, onSet_ExisteCajaAbierta] = useState(false);
  const [cajaActual, onSet_CajaActual] = useState([]);
  const [modalInfoEmpresa, onModal_InfoEmpresa] = useState(false);

  //#region [PRODUCTOS VENTA]
  const catalogo = [];

  const onSearch_CategoriasProdVenta = async () => {
    try {
      const response = await fetch(`/api/categoriasprodventa`);
      if (!response.ok) {
        throw new Error(`Error al obtener las categorias: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        console.log("No hay categorías de productos");
      } else {
        const listadoCategoriasPV = [{ idCategoriaProdVenta: "", nombre: "---Todas---" }, ...data];
        setCategorias(listadoCategoriasPV);
        data.forEach((item) => {
          catalogo.push({ value: item.idCategoriaProdVenta, label: item.nombre });
        });
        setCatalogoCategorias(catalogo);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSearch_ProductosVenta = async () => {
    try {
      const response = await fetch(`/api/productosventa`);
      if (!response.ok) {
        throw new Error(`Error al obtener los productos: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        //toast.warning('No se encontraron registros');
      } else {
        setListadoProductos(data);
        setProductos(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Sucedió un error al obtener los productos');
    } finally {
      setLoading(false);
    }
  };

  const onSet_TabActivo = (id) => {
    const tabs = document.querySelectorAll('.tab-categorias');
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    let item = document.getElementById("tab_" + id);
    item.classList.add("tab-active");

    if (id === "") {
      setProductos(listadoProductos);
    } else {
      const productosFiltrados = listadoProductos.filter(p => p.idCategoriaProdVenta === id);
      setProductos(productosFiltrados);
    }
  };
  //#endregion

  //#region [INICIO / CIERRE CAJA]
  const onGet_CajaActual = async () => {
    try {
      const response = await fetch(`/api/current`);
      if (!response.ok) {
        throw new Error(`Error al obtener la info de caja: ${response.statusText}`);
      }
      const results = await response.json();

      if (results.data.length === 0) {
        onSet_ExisteCajaAbierta(false);
        onModal_IniciarCaja(true);
        onSet_CajaActual(null);
        //toast.warning(results.message);
      } else {
        onSet_CajaActual(results.data);
        onSet_ExisteCajaAbierta(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Sucedió un error al obtener la info de caja');
    }
  };
  //#endregion

  //#region [EMPRESA]
  const onSearch_InfoEmpresa = useCallback(async () => {
    try {
      const response = await fetch(`/api/empresa`);
      if (!response.ok) {
        throw new Error(`Error al obtener la información de la empresa: ${response.statusText}`);
      }
      const result = await response.json();

      if (result.status === "success") {
        onSet_InfoEmpresa(result.data);
        onSearch_CategoriasProdVenta();
        onSearch_ProductosVenta();
        onGet_CajaActual();
      } else if (result.code === 204) {
        onModal_InfoEmpresa(true);
        console.log("No hay info de la empresa");
      } else {
        console.log("Error al obtener la info: " + result.message);
        toast.error("Sucedió un error al obtener la información de la empresa");
      }
    } catch (error) {
      console.log("Error al obtener la info: " + error);
    }
  }, []);

  useEffect(() => {
    onSearch_InfoEmpresa();
  }, [onSearch_InfoEmpresa]);
  //#endregion

  //#region [CLIENTES]
  const onSearch_Cliente = async (value) => {
    try {
      const response = await fetch(`/api/clientes/${value}`);
      if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        AddRemoveClassById("txtSelCliente", "", "is-valid");
        AddRemoveClassById("txtSelCliente", "", "is-invalid");
        onModal_AgregarClientePos(true);
      } else {
        if (data.length === 1) {
          toast.success('Se ha encontrado el cliente');
          setNombreCliente(data[0].nombre + " " + data[0].apellido);
          setModelReceptor(data[0]);
          AddRemoveClassById("txtSelCliente", "is-valid", "is-invalid");
        } else {
          toast.info('Se encontraron múltiples registros, seleccione el correcto');
          onModal_MultiplesClientes(true);
          setListaMultiplesClientes(data);
          AddRemoveClassById("txtSelCliente", "", "is-invalid");
          AddRemoveClassById("txtSelCliente", "", "is-valid");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Sucedió un error al obtener los clientes');
    }
  };

  const onSelect_Enter = (event) => {
    if (event.key === 'Enter') {
      toast.info("Buscando...");
      onSearch_Cliente(nombreCliente);
    }
  };

  const onChange_Cliente = (cliente) => {
    setNombreCliente(cliente.nombre + " " + cliente.apellido);
    setModelReceptor(cliente);
    onModal_MultiplesClientes(false);
    AddRemoveClassById("txtSelCliente", "is-valid", "is-invalid");
    toast.success("Cliente seleccionado");
  };
  //#endregion

  //#region [DETALLES FACTURA]
  const onAdd_LineaDetalle = (obj) => {
    var existeCliente = document.getElementById("txtSelCliente").value !== "";

    if (!existeCliente) {
      toast.warning("Debe seleccionar un cliente");
      document.getElementById("txtSelCliente").classList.add("is-invalid");
    } else {
      document.getElementById("txtSelCliente").classList.remove("is-invalid");

      const newRow = {
        id: rows.length + 1,
        cantidad: 1,
        detalles: obj.nombre,
        precio: obj.precio,
        idProductoVenta: obj.productoVentaId,
        cantMinima: obj.cantMinima,
        cantProducto: obj.cantDisponible
      };

      setRows([...rows, newRow]);
      setTotal(total + Number(newRow.precio * newRow.cantidad));
    }
  };

  const onDelete_LineaDetalle = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);

    const newTotal = updatedRows.reduce((acc, curr) => acc + (Number(curr.cantidad) * Number(curr.precio)), 0);
    setTotal(Number(newTotal.toFixed(2)));
  };

  const onChange_CantPrecio = (e, id, field) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: e.target.value } : row
    );
    setRows(updatedRows);
    if (field === 'cantidad' || field === 'precio') {
      const newTotal = updatedRows.reduce((acc, curr) => acc + (Number(curr.cantidad) * Number(curr.precio)), 0);
      setTotal(newTotal);
    }
  };
  //#endregion

  //#region [CREAR FACTURA]
  const onCreate_ModelFactura = () => {
    var r = modelReceptor;
    var c = infoEmpresa;

    var objetoFactura = {
      FechaEmision: new Date(),
      Emisor: {
        Nombre: c.nombre,
        NombreComercial: c.nombreComercial,
        Identificacion: c.identificacion,
        Telefono: c.telefono,
        Celular: c.celular,
        Correo: c.correo,
        Direccion: {
          DireccionExacta: c.direccion
        }
      },
      Receptor: {
        ClienteId: r.clienteId,
        Nombre: FormatName(r.nombre, r.apellido),
        Email: r.email,
        Telefono: r.telefono !== "" ? r.telefono : "0000-0000",
        Celular: r.celular !== "" ? r.celular : "0000-0000",
        Direccion: {
          DireccionExacta: r.direccion
        }
      }
    };

    var listaDetalles = rows.map(row => ({
      NumeroLinea: row.id,
      Cantidad: row.cantidad,
      Descripcion: row.detalles,
      Precio: row.precio,
      IdProductoVenta: row.idProductoVenta
    }));

    objetoFactura.Detalles = listaDetalles;
    objetoFactura.Observaciones = "";
    objetoFactura.Total = total;
    objetoFactura.idInfoCaja = cajaActual.idInfoCaja;

    setModelFactura(objetoFactura);
  };

  const onClear_Factura = (json) => {
    console.log(json);
    onSearch_ProductosVenta();
    setRows([]);
    setTotal(0);
    setNombreCliente("");
    setModelReceptor(null);
    AddRemoveClassById("txtSelCliente", "", "is-valid");
    AddRemoveClassById("txtSelCliente", "", "is-invalid");
    onSet_ObjectImpresion(json);
    onModal_Print(true);
  };
  //#endregion

  //#region [ON_INIT]
  useEffect(() => {
    const timer = setTimeout(() => {
      const tabTodas = document.getElementById("tab_");
      if (tabTodas) {
        tabTodas.classList.add("tab-active");
        setProductos(listadoProductos);
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [categorias, listadoProductos]);
  //#endregion

  return (
    <div style={{ overflow: 'hidden' }} className="flex h-screen">
      <div className="w-5/6">
        <div className="w-full p-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="pl-2 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <HtmlBreadCrumb items={itemsBreadCrumb} />
            </ol>
          </nav>
        </div>
        <div className="pl-4 grid grid-cols-1 md:grid-cols-12 gap-4 mx-auto">
          <div className="md:col-span-2">
            <div className="mt-1">
              {
                existeCajaAbierta ? (
                  <HtmlButton color={"purple"} legend={"Productos"} icon={HandPlatter} onClick={() => openModalAgregar(true)} />
                ) : null
              }
            </div>
          </div>

        </div>
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {
            existeCajaAbierta ? (
              <div className="p-2">


                <div className="border-b border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">

                    {categorias.map((item, index) => (
                      <li className="me-2" key={index}>
                        <a href="#" id={`tab_${item.idCategoriaProdVenta}`} onClick={() => onSet_TabActivo(item.idCategoriaProdVenta)} className="tab-categorias inline-block p-4 hover:text-blue-600 rounded-t-lg dark:hover:text-blue-600 ">
                          {item.nombre}
                        </a>
                      </li>
                    ))}

                  </ul>
                </div>

                <div style={{ maxHeight: '30rem', overflowY: 'auto' }} className="mt-4 grid grid-cols-2 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productos.map((item, index) => {
                      const bufferImagen = Buffer.from(item.imagen.data);
                      const imgBase64 = bufferImagen.toString('base64');

                      const imgSrc = `data:${item.tipoImagen};base64,${imgBase64}`;
                      const modelForCard = {
                        productoVentaId: item.idProductoVenta,
                        nombre: item.nombre,
                        precio: item.precio,
                        cantDisponible: item.cantidad,
                        cantMinima: item.cantidadMinima,
                        imagen: imgSrc,
                        idCategoriaProdVenta: item.idCategoriaProdVenta
                      };

                      return (
                        <CartaComida 
                          key={item.idProductoVenta} // Asegúrate de usar una propiedad única
                          producto={modelForCard} 
                          reloadTable={onSearch_ProductosVenta} 
                          agregarProductoTabla={onAdd_LineaDetalle} 
                        />
                      );
                    })}
                  </div>

              </div>
            ) : null
          }

        </div>
      </div>
      {
        existeCajaAbierta ? (
          <aside style={{ overflow: 'auto', width: '38%', height: '50rem' }} className="bg-gray-200 dark:bg-gray-800 overflow-y-auto">
            <div className="p-2">
              <h2 className="font-semibold pt-4 pl-4 text-lg dark:text-gray-100">Fecha: {fechaActual}</h2>
              <h2 className="font-semibold pt-4 pl-4 text-lg dark:text-gray-100">Caja Actual: # {!cajaActual.idInfoCaja ? 0 : cajaActual.idInfoCaja}</h2>

            </div>
            <div className="p-4">
              <HtmlFormInput value={nombreCliente} id={"txtSelCliente"} legend={"Nombre del cliente"} onChange={(e) => setNombreCliente(e.target.value)} onKeyUp={onSelect_Enter} />
            </div>

            <div className="p-4">
              <div style={{ maxHeight: '22rem', overflowY: 'auto' }}>
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-3 py-3 text-left text-sm font-medium text-black uppercase w-15 dark:bg-gray-700 dark:text-white">Cant.</th>
                      <th className="px-5 py-3 text-left text-sm font-medium text-black uppercase w-20 dark:bg-gray-700 dark:text-white">Detalles</th>
                      <th className="px-15 py-3 text-left text-sm font-medium text-black uppercase w-5 dark:bg-gray-700 dark:text-white">Precio</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase dark:bg-gray-700 dark:text-white">...</th>
                      <th hidden className="px-6 py-3 text-left text-sm font-medium text-black uppercase dark:bg-gray-700 dark:text-white">IdProducto</th>
                      <th hidden className="px-6 py-3 text-left text-sm font-medium text-black uppercase dark:bg-gray-700 dark:text-white">CantMinima</th>
                      <th hidden className="px-6 py-3 text-left text-sm font-medium text-black uppercase dark:bg-gray-700 dark:text-white">CantDisponible</th>

                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={row.cantidad}
                            max={row.cantProducto}
                            onChange={(e) => onChange_CantPrecio(e, row.id, 'cantidad')}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-14 p-1"
                          />
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.detalles}
                            onChange={(e) => onChange_CantPrecio(e, row.id, 'detalles')}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-35 p-1"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.precio}
                            onChange={(e) => onChange_CantPrecio(e, row.id, 'precio')}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-16 p-1"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <HtmlTableButton color={"red"} icon={Trash} onClick={() => onDelete_LineaDetalle(row.id)} />
                        </td>
                        <td hidden className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.idProductoVenta}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-16 p-1"
                          />
                        </td>
                        <td hidden className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.cantMinima}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-16 p-1"
                          />
                        </td>
                        <td hidden className="px-3 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.cantProducto}
                            className="dark:bg-gray-900 dark:text-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-16 p-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-2 pt-2">
                {total > 0 && (
                  <div className="flex justify-between dark:text-gray-100">
                    <h3 className="font-semibold text-lg">Total Factura:</h3>
                    <p className="font-semibold text-lg"><span>₡</span> {total.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pl-4 pr-4 grid grid-rows-12">
              {total > 0 && (

                <div className="row-span-4 flex items-center ">
                  <HtmlButton color={"green"} legend={"Pagar"} icon={CoinsIcon} onClick={() => {
                    onModal_RegistrarPago(true); onCreate_ModelFactura(); onModal_Print(false);
                  }} />
                </div>
              )}
            </div>
          </aside>
        ) : null
      }

      <AgregarProductoVenta open={modalAgregar} onClose={() => openModalAgregar(false)} setOptions={catalogoCategoria} reloadProducts={onSearch_ProductosVenta} infoEmpresa={infoEmpresa}  />
      <MultipleSelectCliente open={modalMultipleClientes} onClose={() => onModal_MultiplesClientes(false)} listaClientes={listaMultiplesClientes} handleClienteInput={onChange_Cliente} />
      <ModalRegistrarPago open={modalRegistrarPago} onClose={() => onModal_RegistrarPago(false)} objFactura={modelFactura} onReload={onClear_Factura} />
      <AgregarCLientePos open={modalAgregarClientePos} onClose={() => onModal_AgregarClientePos(false)} />
      <PrintTicket open={modalPrint} onClose={() => { onModal_Print(false) }} json={objectImpresion} />
      <IniciarCaja open={modalIniciarCaja} onClose={() => { onModal_IniciarCaja(false) }} />
      <IngresarInfoEmpresa open={modalInfoEmpresa} onClose={() => { onModal_InfoEmpresa(false) }} />
      <Toaster richColors />
    </div>

  );

  //#endregion

}
