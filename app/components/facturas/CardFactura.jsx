import { AlertCircleIcon, Calendar, Coins, User2, CheckCircleIcon, XCircleIcon, Ban, Printer, List, CreditCard, Banknote, ArrowLeftRight, CoinsIcon } from "lucide-react";
import HtmlNewLabel from "../HtmlHelpers/Label1";
import HtmlTableButton from "../HtmlHelpers/TableButton";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import TicketFactura from "../pos/ticket";
import { useReactToPrint } from "react-to-print";
import { ClipLoader } from "react-spinners";
import AnularPagarFactura from "./AnularPagarFactura";

export default function CardFactura({ factura, infoEmpresa,vistaDetalles,accion,idFactura }) {
  const [onLoading, onSet_onLoading] = useState(false);
  const [documentoJson, onSet_DocJson] = useState(null);
  const [action, onSet_Action] = useState("");
  const ticketRef = useRef();

  //Modals
  const [modalAnularPagar,onModal_AnularPagar] = useState(false);

  const colorStatus = (() => {
    switch (factura.estadoFac) {
      case "ACTIVA":
        return "amber";
      case "PAGADA":
        return "green";
      default:
        return "pink";
    }
  })();

  const statusIcons = {
    "ACTIVA": CheckCircleIcon,
    "PAGADA": CheckCircleIcon,
    "OTRO": XCircleIcon,
  };

  const StatusIcon = statusIcons[factura.estadoFac] || AlertCircleIcon;

  const iconsMedioPago = {
    "Efectivo": Banknote,
    "Tarjeta": CreditCard,
    "Transferencia / Sinpe": ArrowLeftRight,
  };

  const IconPagoMap = iconsMedioPago[factura.medioPago] || CoinsIcon;

  // #region [OBTENER JSON]
  const onGet_JsonFactura = useCallback(async (facturaId, action) => {
    onSet_onLoading(true);
    onSet_DocJson(null);
    onSet_Action("");
    try {
      if (!facturaId) {
        toast.error("No fue proporcionado un Id para buscar la factura");
      }
      else {
        const response = await fetch(`/api/factura/${facturaId}`);
        const result = await response.json();
        if (result.status === "success") {
          if (action == "print") {
            toast.info("Imprimiendo factura...");
            onSet_Action("print")
            const newJson = JSON.parse(result.data.documentoJson);
            newJson.Consecutivo = Number(facturaId);
            newJson.EsReimpresion = true;

            if (infoEmpresa.logo && infoEmpresa.tipoImagen) {
              const bufferImagen = Buffer.from(infoEmpresa.logo);
              const imgBase64 = bufferImagen.toString('base64');
              const imgSrc = `data:${infoEmpresa.tipoImagen};base64,${imgBase64}`;
              newJson.LogoSource = imgSrc;
            }
            else {
              newJson.LogoSource = "/petote.png";
            }
            handleReprint(newJson)
          }

          if(action == "details"){
            toast.info("Mostrando Detalles...");
            onSet_Action("details");
            const newJson = JSON.parse(result.data.documentoJson);
            vistaDetalles(newJson);
          }
        } 
        else {
          console.log(result.message);
          toast.error(result.message);
        }
      }
    } 
    catch (error) {
      console.error("Error al obtener el cliente:", error);
      toast.error("Sucedió un error al obtener el cliente: " + error);
    } 
    finally {
      onSet_onLoading(false);
    }
  }, []);
  // #endregion

  // #region [RE-IMPRIMIR FACTURA]
  const handleReprint = (item) => {
    onSet_DocJson(item);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
    documentTitle: "Factura",
  });
  //#endregion

  return (
    <div className="border bg-white dark:bg-gray-800 p-4 flex flex-col rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">
          Factura No: {factura.idFactura.toString().padStart(6, "0")}
        </h5>
        <HtmlNewLabel
          color={colorStatus}
          icon={StatusIcon}
          legend={factura.estadoFac}
          className="w-full"
        />
      </div>
      <div className="flex items-center mb-2">
        <Calendar className="mr-2 text-gray-600" />
        <span className="text-gray-800 dark:text-gray-300">
          {new Date(factura.fechaEmision).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center mb-2">
        <User2 className="mr-2 text-gray-600" />
        <span className="text-gray-800 dark:text-gray-300">
          {factura.nombreCliente}
        </span>
      </div>
      <div className="flex items-center">
        <IconPagoMap className="mr-2 text-gray-600" />
        <span className="text-gray-800 dark:text-gray-300">
          ₡{factura.total} / {factura.medioPago}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 mt-4">
        {
          onLoading ? (
            <div className="flex items-center justify-center m-4">
              <ClipLoader size={30} speedMultiplier={1.5} />
            </div>
          ) : (
            <div className="col-span-1">
              {/* Botón para ver detalles, llama a la función con idFactura */}
              <HtmlTableButton
                color={"blue"}
                tooltip={"Ver Detalles"}
                icon={List}
                onClick={() => onGet_JsonFactura(factura.idFactura,"details")}
              />

              {/* Botón para reimprimir, llama a la función con idFactura */}
              <HtmlTableButton
                color={"cyan"}
                tooltip={"Reimprimir"}
                onClick={() => onGet_JsonFactura(factura.idFactura, "print")}
                icon={Printer}
              />

              {factura.estadoFac === "PAGADA" || factura.estadoFac === "ACTIVA" ? (
                  <HtmlTableButton color={"red"} tooltip={"Anular"} onClick={() => { accion("cancel", factura.idFactura)}} icon={Ban} />
              ) : null}

              {factura.estadoFac === "ACTIVA" ? (
                  <HtmlTableButton color={"emerald"} icon={CreditCard} onClick={() => { accion("pay", factura.idFactura) }} tooltip={"Validar Pago"} />
              ) : null}
            </div>
          )}

      </div>
      {documentoJson && action == "print" && (
        <div style={{ display: "none" }}>
          <TicketFactura ref={ticketRef} item={documentoJson} />
        </div>
      )}

      
    </div>

  );
}
