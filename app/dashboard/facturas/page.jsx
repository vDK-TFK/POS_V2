'use client';

import { FormatOnlyDate, GetValueById } from "@/app/api/utils/js-helpers";
import AnularPagarFactura from "@/app/components/facturas/AnularPagarFactura";
import CardFactura from "@/app/components/facturas/CardFactura";
import DetallesFactura from "@/app/components/facturas/DetallesFactura";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import HtmlFormSelect from "@/app/components/HtmlHelpers/FormSelect";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const itemsBreadCrumb = ["Dashboard", "Facturas"];

export default function ListaFacturas() {
  const fetchCalled = useRef(false);
  const [listaFacturas, onSet_ListaFacturas] = useState([]);
  const [openDetalles, onModal_OpenDetalles] = useState(false);
  const [infoEmpresa, onSet_InfoEmpresa] = useState(null);
  const [onLoading, onSet_onLoading] = useState(false);
  const [jsonFactura, onSet_JsonFactura] = useState(null);
  const [openAnularPagar, onModal_OpenAnularPagar] = useState(false);
  const [idFactura, onSet_IdFactura] = useState(0);
  const [action, onSet_Action] = useState("");
  
  //Medios Pago
  const listaMediosPago = [
    { IdMedioPago: 1, Nombre: "Efectivo" },
    { IdMedioPago: 2, Nombre: "Tarjeta" },
    { IdMedioPago: 3, Nombre: "Transferencia / Sinpe" }
  ];

  const mediosPago = listaMediosPago.map(medio => ({
    value: medio.IdMedioPago,
    label: medio.Nombre
  }));

  // Estados
  const listaEstadosFact = [
    { IdEstado: 'ACTIVA', Nombre: "Activa" },
    { IdEstado: 'PAGADA', Nombre: "Pagada" },
    { IdEstado: 'NULA', Nombre: "Nula" }
  ];

  const estadosFactura = listaEstadosFact.map(estado => ({
    value: estado.IdEstado,
    label: estado.Nombre
  }));

  // Función para formatear fecha a YYYY-MM-DD
  const formatDateToLocalString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Estado del formulario
  const [formData, setFormData] = useState({
    fechaInicial: formatDateToLocalString(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    fechaFinal: formatDateToLocalString(new Date()),
  });



  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo cambiar las fechas
    if (name === "fechaInicial" || name === "fechaFinal") {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    else{
      setFormData((prev) => ({ ...prev, [name]: value }));
    } 

  };



  const onSearch_InfoEmpresa = useCallback(async () => {
    try {
      const response = await fetch(`/api/empresa`);
      const result = await response.json();

      if (result.status === "success") {
        onSet_InfoEmpresa(result.data);
      } else {
        console.log(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error al obtener la información de la empresa', error);
      toast.error("Error al obtener la información de la empresa");
    }
  }, []);

  const onSearch_Facturas = useCallback(async () => {
    onSet_onLoading(true);
    try {
      // Crear objeto de fecha desde la cadena de fecha inicial
      const fechaInicio = new Date(`${formData.fechaInicial}T00:00:00Z`);

      // Crear objeto de fecha desde la cadena de fecha final
      const fechaFin = new Date(`${formData.fechaFinal}T00:00:00Z`);
      // Sumar 6 horas a la fecha final
      
      // Establecer la fecha final a las 23:59:59
      fechaFin.setUTCHours(23);
      fechaFin.setUTCMinutes(59);
      fechaFin.setUTCSeconds(59);
      fechaFin.setUTCHours(fechaFin.getUTCHours() + 6);

      // Crear el modelo para enviar
      let model = {
        fechaInicial: fechaInicio.toISOString(),
        fechaFinal: fechaFin.toISOString(),
        estadoFac: GetValueById("estado"),
        idMedioPago: GetValueById("medioPago")
      };

      console.log(model); // Para verificar la salida

      const response = await fetch('/api/factura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const result = await response.json();

      if (result.status === "success") {
        onSet_ListaFacturas(result.data);
      } else if (result.code === 204) {
        onSet_ListaFacturas([]);
      } else {
        console.log("Error al obtener la info: " + result.message);
        toast.error("Sucedió un error al obtener las facturas");
      }
    } catch (error) {
      console.log("Error al obtener la info: " + error);
    } finally {
      onSet_onLoading(false);
    }
  }, [formData.fechaInicial, formData.fechaFinal]);



  const onView_ListaDetalles = (docJson) => {
    onSet_JsonFactura(docJson);
    onModal_OpenDetalles(true);
  };

  const onAction_AnularPagar = (accion, idFactura) => {
    onSet_Action(accion);
    onSet_IdFactura(idFactura);
    onModal_OpenAnularPagar(true);
  };

  const onSearch_ListaFacturas = () => {
    let fechaInicio = new Date(formData.fechaInicial);
    let fechaFin = new Date(formData.fechaFinal);
    let hoy = new Date();

    if (fechaInicio > fechaFin) {
      toast.warning("La fecha inicial debe ser menor a la fecha final");
    } else if (fechaFin > hoy) {
      toast.warning("No puede seleccionar fechas futuras");
    } else {
      onSearch_Facturas();
    }
  };

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      onSearch_InfoEmpresa();
      onSearch_Facturas();
    }
  }, [onSearch_Facturas, onSearch_InfoEmpresa]);



  return (
    <>
      <div className="w-full p-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="pl-2 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <HtmlBreadCrumb items={itemsBreadCrumb} />
          </ol>
        </nav>
      </div>

      <div className="w-full pl-4 pr-4">
        <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Listado de facturas
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mx-0">
            <HtmlFormInput legend={"Fecha Inicial"} type={"date"} colSize={1} onChange={(e) => {handleChange(e)}} value={formData.fechaInicial} name={"fechaInicial"}/>
            <HtmlFormInput legend={"Fecha Final"} type={"date"} colSize={1} onChange={(e) => { handleChange(e) }} value={formData.fechaFinal} name={"fechaFinal"} />
            <HtmlFormSelect legend={"Estado Factura"} options={estadosFactura} colSize={1} id={"estado"} />
            <HtmlFormSelect legend={"Medio de Pago"} options={mediosPago} colSize={1}  id={"medioPago"} />
            <div className="mt-7">
              <HtmlButton color={"blue"} icon={Search} legend={"Buscar"} onClick={onSearch_ListaFacturas} />

            </div>
          </div>
          <hr className="mt-4 mb-4" />
          {
            onLoading ? (
              <div className="flex items-center justify-center m-4">
                <ClipLoader size={30} speedMultiplier={1.5} />
              </div>
            ) : (
                <div style={{ maxHeight: '19rem', overflowY: 'auto' }} className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-0">
                  {listaFacturas.map((item, index) => (
                    <div className="col-span-1">
                      <CardFactura key={index} factura={item} infoEmpresa={infoEmpresa} vistaDetalles={onView_ListaDetalles} accion={onAction_AnularPagar} idFactura={idFactura} />
                    </div>
                  ))}
                </div>

            )
          }
          
        </div>
      </div>
      <DetallesFactura open={openDetalles} onClose={() => { onModal_OpenDetalles(false) }} factura={jsonFactura}/>
      <AnularPagarFactura open={openAnularPagar} onClose={() => { onModal_OpenAnularPagar(false) }} idFactura={idFactura} action={action} onReload={onSearch_Facturas} />


    </>
  );
 }