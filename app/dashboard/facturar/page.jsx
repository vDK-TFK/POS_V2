'use client'
import { AddRemoveClassById, FormatName } from "@/app/api/utils/js-helpers";
import IniciarCaja from "@/app/components/caja/iniciarCaja";
import MultipleSelectCliente from "@/app/components/clientes/multipleSelectCliente";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import HtmlNewLabel from "@/app/components/HtmlHelpers/Label1";
import HtmlTableButton from "@/app/components/HtmlHelpers/TableButton";
import AgregarCLientePos from "@/app/components/pos/agregarClientePos";
import IngresarInfoEmpresa from "@/app/components/pos/agregarInfoEmpresa";
import AgregarProductoVenta from "@/app/components/pos/agregarProdVenta";
import CartaComida from "@/app/components/pos/cartaComida";
import ModalRegistrarPago from "@/app/components/pos/modalPago";
import PrintTicket from "@/app/components/pos/printTicket";
import { Calendar, CalendarCheck, CoinsIcon, Computer, HandPlatter, Trash, User } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
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

  //Loadings
  const [loadingProdVenta, onSet_loadingProdVenta] = useState(false);
  const [loadingCategorias, onSet_loadingCategorias] = useState(false);
  const [loadingClientes, onSet_loadingClientes] = useState(false);


  //Sesion
  const { data: session } = useSession();



  //Debe ir validando de forma cronológica (Empresa, Caja, Productos...)

  //#region [INFO. EMPRESA]
  const onSearch_InfoEmpresa = useCallback(async () => {
    try {
      const response = await fetch(`/api/empresa`);
      const result = await response.json();

      if (result.status === "success") {
        onSet_InfoEmpresa(result.data);
        onGet_CajaActual();
        onInit_Component();
      } 
      else if (result.code === 204) {
        onModal_InfoEmpresa(true);
        console.log("No hay info de la empresa");
      } 
      else {
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

  const onInit_Component = function(){
    onSearch_CategoriasProdVenta();
    onSearch_ProductosVenta();
    

  };

  //#region [PRODUCTOS VENTA]
  const catalogo = [];

  const onSearch_CategoriasProdVenta = async () => {
    onSet_loadingCategorias(true);
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
    finally{
      onSet_loadingCategorias(false);
    }
  };

  const onSearch_ProductosVenta = async () => {
    onSet_loadingProdVenta(true);
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
      onSet_loadingProdVenta(false)
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
    const session1 = await getSession();
    let idUsuario = Number(session1?.user.id);
    try {
      const response = await fetch(`/api/current/${idUsuario}`);
      const result = await response.json();

      if (result.status == "success") {
        onSet_CajaActual(result.data);
        onSet_ExisteCajaAbierta(true);
      }
      else if (result.code == 204) {
        onSet_ExisteCajaAbierta(false);
        onModal_IniciarCaja(true);
        onSet_CajaActual(null);
      }
      else {
        onSet_CajaActual(null);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error al obtener la caja actual:", error);
      toast.error("Sucedió un error al obtener la caja actual");
    }
  };
  //#endregion

  
  //#region [CLIENTES]
  const onSearch_Cliente = async (value) => {
    onSet_loadingClientes(true);
    try {
      const response = await fetch(`/api/clientes/buscar/${value}`);
      if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        AddRemoveClassById("txtSelCliente", "", "is-valid");
        AddRemoveClassById("txtSelCliente", "", "is-invalid");
        onModal_AgregarClientePos(true);
      } 
      else {
        if (data.length === 1) {
          toast.success('Se ha encontrado el cliente');
          setNombreCliente(data[0].nombreCompleto);
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
    finally{
      onSet_loadingClientes(false);
    }
  };

  const onSelect_Enter = (event) => {
    if (event.key === 'Enter') {
      toast.info("Buscando...");
      onSearch_Cliente(nombreCliente);
    }
  };

  const onChange_Cliente = (cliente) => {
    setNombreCliente(cliente.nombreCompleto);
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
    const tabTodas = document.getElementById("tab_");
    if (tabTodas) {
      tabTodas.classList.add("tab-active");
      setProductos(listadoProductos);
      setLoading(false);
    }
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
        <div className="w-full pl-4 pr-4">
          <div className="block w-full p-2 bg-white border border-gray-200 rounded-lg shadow">


              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mx-auto">
                {
                  existeCajaAbierta ? (
                    <>
                      <HtmlButton colSize={1} color={"indigo"} legend={"Agregar Producto"} icon={HandPlatter} onClick={() => openModalAgregar(true)} />
                    </>
                  ) : null
                }
              </div>
            
            
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {
            existeCajaAbierta ? (
              <div className="p-2">

                <div className="border-b border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">

                  {
                    loadingCategorias ? (
                      <div className="flex items-center justify-center m-4">
                        <ClipLoader size={30} speedMultiplier={1.5} />
                      </div>
                    ) : (
                      categorias.map((item, index) => (
                        <li className="me-3" key={index}>
                          <a
                            href="#"
                            id={`tab_${item.idCategoriaProdVenta}`}
                            onClick={() => onSet_TabActivo(item.idCategoriaProdVenta)}
                            className="tab-categorias inline-block p-4 hover:text-blue-600 rounded-t-lg dark:hover:text-blue-600"
                          >
                            {item.nombre}
                          </a>
                        </li>
                      ))
                    )
                  }

                    

                  </ul>
                </div>
                
                {
                  loadingProdVenta ? (
                        <div className="flex items-center justify-center m-4">
                          <ClipLoader size={30} speedMultiplier={1.5} />
                        </div>
                  ) : (
                    <div style={{ maxHeight: '30rem', overflowY: 'auto' }} className="mt-4 grid grid-cols-2 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productos.map((item, index) => {
                        var bufferImagen;
                        var imgBase64;
                        var imgSrc;

                        if (item.imagen && item.tipoImagen) {
                          bufferImagen = Buffer.from(item.imagen.data);
                          imgBase64 = bufferImagen.toString('base64');
                          imgSrc = `data:${item.tipoImagen};base64,${imgBase64}`;
                        }
                        else {
                          imgSrc = "/petote.png"
                        }

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
                  )
                }


              </div>
            ) :
            null

          }

        </div>


          

          </div>
        </div>


      </div>
      {/* Card Factura */}
      {
        existeCajaAbierta ? (
          <aside style={{ overflow: 'auto', width: '35%', height: '100vh' }} className=" overflow-y-auto">
            <div className="w-full pl-2 pr-1 ">
              <div className="block w-full h-screen  p-4 bg-white border border-gray-200 rounded-lg shadow">

                {/* Legends info */}
                <div className="mb-3 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                  <HtmlNewLabel icon={User} legend={"Vendedor: " + session?.user.name} color={"lime"} />
                </div>

                <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
                  <HtmlNewLabel icon={Calendar} legend={fechaActual} color={"blue"} />
                  <HtmlNewLabel icon={Computer} legend={"Caja No: " + cajaActual.idInfoCaja} color={"green"} />

                  {/* <div className="col-span-1">
                  </div> */}
                </div>
                {/* Legends info */}

                {/* Client Filter */}
                {
                  loadingClientes ? (
                    <div className="flex items-center justify-center m-4">
                        <ClipLoader size={30} speedMultiplier={1.5} />
                    </div>
                  ) : 
                  (
                    <HtmlFormInput additionalClass={"text-xs"} tooltip={"Ingresa un valor y presiona enter para buscar"} value={nombreCliente} id={"txtSelCliente"} legend={"Nombre del cliente"} onChange={(e) => setNombreCliente(e.target.value)} onKeyUp={onSelect_Enter} />
                  )
                }

                {/* Details */}
                <div className="">
                  <div style={{ maxHeight: '18rem', overflowY: 'auto' }}>
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
                              <HtmlTableButton tooltip={"Eliminar Línea"} color={"red"} size={12} padding={2} icon={Trash} onClick={() => onDelete_LineaDetalle(row.id)} />
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

                

              </div>
            </div>




          </aside>
        ) : <ClipLoader size={30} speedMultiplier={1.5} />
      }

      <AgregarProductoVenta open={modalAgregar} onClose={() => openModalAgregar(false)} setOptions={catalogoCategoria} reloadProducts={onSearch_ProductosVenta} infoEmpresa={infoEmpresa}  />
      <MultipleSelectCliente open={modalMultipleClientes} onClose={() => onModal_MultiplesClientes(false)} listaClientes={listaMultiplesClientes} handleClienteInput={onChange_Cliente} />
      <ModalRegistrarPago open={modalRegistrarPago} onClose={() => onModal_RegistrarPago(false)} objFactura={modelFactura} onReload={onClear_Factura} />
      <AgregarCLientePos open={modalAgregarClientePos} onClose={() => onModal_AgregarClientePos(false)} />
      <PrintTicket open={modalPrint} onClose={() => { onModal_Print(false) }} json={objectImpresion} />
      <IniciarCaja open={modalIniciarCaja} onClose={() => { onModal_IniciarCaja(false) }} />
      <IngresarInfoEmpresa open={modalInfoEmpresa} onClose={() => { onModal_InfoEmpresa(false) }} />
    </div>

  );

  //#endregion

}
