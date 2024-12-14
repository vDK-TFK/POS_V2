"use client"
import { FormatCurrency, FormatOnlyDate, GetValueById } from "@/app/api/utils/js-helpers";
import AnularPagarFactura from "@/app/components/facturas/AnularPagarFactura";
import CardFactura from "@/app/components/facturas/CardFactura";
import DetallesFactura from "@/app/components/facturas/DetallesFactura";
import HtmlBreadCrumb from "@/app/components/HtmlHelpers/BreadCrumb";
import HtmlButton from "@/app/components/HtmlHelpers/Button";
import HtmlFormInput from "@/app/components/HtmlHelpers/FormInput";
import HtmlFormSelect from "@/app/components/HtmlHelpers/FormSelect";
import { Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
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
    if (name === "fechaInicial" || name === "fechaFinal") {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
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
      const fechaInicio = new Date(`${formData.fechaInicial}T00:00:00Z`);
      const fechaFin = new Date(`${formData.fechaFinal}T23:59:59Z`);

      let model = {
        fechaInicial: fechaInicio.toISOString(),
        fechaFinal: fechaFin.toISOString(),
        estadoFac: GetValueById("estado"),
        idMedioPago: GetValueById("medioPago")
      };

      const response = await fetch('/api/factura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      const result = await response.json();

      if (result.status === "success") {
        onSet_ListaFacturas(result.data);
        toast.success("Se ha obtenido la información");
      } else if (result.code === 204) {
        toast.warning(result.message);
        onSet_ListaFacturas([]);
      } else {
        onSet_ListaFacturas([]);
        toast.error("Sucedió un error al obtener las facturas");
      }
    } catch (error) {
      console.log("Error al obtener las facturas: " + error);
      toast.error("Sucedió un error al obtener las facturas: " + error);
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

  const onExport_Facturas = () => {
    if (listaFacturas.length === 0) {
      toast.warning("No hay datos para exportar.");
      return;
    }

    const formattedData = listaFacturas.map(factura => ({
      "ID Factura": factura.idFactura.toString().padStart(6, '0'),
      "Cliente": factura.nombreCliente || "N/A",
      "Fecha Emisión": factura.fechaEmision,
      "Estado": factura.estadoFac,
      "Medio de Pago": factura.medioPago,
      "Total": `₡ ${factura.total}`,
    }));

    // Crear hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Estilo para el encabezado
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Aplicar estilo a los encabezados
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }

    // Estilo para las celdas del contenido
    const cellStyle = {
      alignment: { horizontal: "left", vertical: "center" },
      font: { color: { rgb: "333333" } }
    };

    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = cellStyle;
      }
    }

    // Configurar anchos de columna
    const columnWidths = [
      { wch: 12 }, // ID Factura
      { wch: 25 }, // Cliente
      { wch: 20 }, // Fecha Emisión
      { wch: 15 }, // Estado
      { wch: 20 }, // Medio de Pago
      { wch: 15 }  // Total
    ];
    worksheet['!cols'] = columnWidths;

    // Crear libro de Excel y hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas Filtradas");

    // Generar archivo Excel
    XLSX.writeFile(workbook, "FacturasFiltradas.xlsx");
    toast.success("Archivo exportado con éxito.");
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mx-0">
            <HtmlFormInput legend={"Fecha Inicial"} type={"date"} colSize={1} onChange={handleChange} value={formData.fechaInicial} name={"fechaInicial"} />
            <HtmlFormInput legend={"Fecha Final"} type={"date"} colSize={1} onChange={handleChange} value={formData.fechaFinal} name={"fechaFinal"} />
            <HtmlFormSelect legend={"Estado Factura"} options={estadosFactura} colSize={1} id={"estado"} />
            <HtmlFormSelect legend={"Medio de Pago"} options={mediosPago} colSize={1} id={"medioPago"} />
            <div className="mt-7 flex gap-4">
              <HtmlButton color={"blue"} icon={Search} legend={"Buscar"} onClick={onSearch_ListaFacturas} />
              <HtmlButton color={"green"} icon={Download} legend={"Exportar"} onClick={onExport_Facturas} />
            </div>
          </div>
          <hr className="mt-4 mb-4" />
          {onLoading ? (
            <div className="flex items-center justify-center m-4">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <div style={{ maxHeight: '19rem', overflowY: 'auto' }} className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-0">
              {listaFacturas.length === 0 ? (
                <div className="col-span-3 text-center">
                  <div className="alert alert-warning" role="alert">
                    No se encontraron registros
                  </div>
                </div>
              ) : (
                listaFacturas.map((item, index) => (
                  <div className="col-span-1" key={index}>
                    <CardFactura
                      factura={item}
                      infoEmpresa={infoEmpresa}
                      vistaDetalles={onView_ListaDetalles}
                      accion={onAction_AnularPagar}
                      idFactura={idFactura}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <DetallesFactura open={openDetalles} onClose={() => onModal_OpenDetalles(false)} factura={jsonFactura} />
      <AnularPagarFactura open={openAnularPagar} onClose={() => onModal_OpenAnularPagar(false)} idFactura={idFactura} action={action} onReload={onSearch_Facturas} />
    </>
  );
}