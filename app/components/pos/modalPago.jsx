import { GetHtmlValueById, GetValueById } from "@/app/api/utils/js-helpers";
import { Coins, File, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import HtmlTextArea from "../HtmlHelpers/TextArea";

export default function ModalRegistrarPago({ open, onClose, objFactura, onReload }) {
  const [pagaCon, setPagaCon] = useState("");
  const [vuelto, setVuelto] = useState(0);
  const [faltante, setFaltante] = useState(0);
  const [medioPagoSeleccionado, onSelect_MedioPago] = useState("");
  const [disableFields, onDisable_Fields] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [showBtn, onShow_Btn] = useState(false);
  const [modalPrint, onModal_Print] = useState(false);
  const [objectJson, onSet_ObjectJson] = useState(null);

  const listaMediosPago = [
    { IdMedioPago: 1, Nombre: "Efectivo" },
    { IdMedioPago: 2, Nombre: "Tarjeta" },
    { IdMedioPago: 3, Nombre: "Transferencia / Sinpe" }
  ];

  const mediosPago = listaMediosPago.map(medio => ({
    value: medio.IdMedioPago,
    label: medio.Nombre
  }));

  const onChange_PagaConInput = (event) => {
    const value = event.target.value;
    setPagaCon(value);
    onChange_PagaCon(value);
  };

  const onChange_PagaCon = (value) => {
    const total = objFactura ? objFactura.Total : 0;
    const pagaConNumber = Number(value);

    if (isNaN(pagaConNumber)) {
      setVuelto(0);
      setFaltante(0);
      return;
    }

    if (pagaConNumber > total) {
      setVuelto(pagaConNumber - total);
      setFaltante(0);
      onShow_Btn(true);
    } else if (pagaConNumber < total) {
      setFaltante((total - pagaConNumber) * -1);
      setVuelto(0);
      onShow_Btn(false);
    } else {
      setVuelto(0);
      setFaltante(0);
      onShow_Btn(true);
    }
  };

  const onChange_MedioPago = (event) => {
    const value = event.target.value;
    onSelect_MedioPago(value);
    onHideShow_Inputs(value);
  };

  const onHideShow_Inputs = (val) => {
    if (val === "") {
      setPagaCon(0);
      setVuelto(0);
      setFaltante(0);
      onDisable_Fields(true);
      onShow_Btn(false);
    } else if (val === "2" || val === "3") {
      setPagaCon(objFactura ? objFactura.Total : 0);
      setVuelto(0);
      setFaltante(0);
      onDisable_Fields(true);
      onShow_Btn(true);
    } else {
      setPagaCon(objFactura ? objFactura.Total : 0);
      onDisable_Fields(false);
      onShow_Btn(true);
    }
  };

  const onChange_Observaciones = (event) => {
    setObservaciones(event.target.value);
  };

  const onValidate_GuardarFact = () => {
    let nodeMedioPago = {
      IdMedioPago: GetValueById("selMedioPago"),
      DescripcionMedioPago: GetHtmlValueById("selMedioPago"),
      MontoFactura: objFactura ? objFactura.Total : 0,
      PagaCon: Number(GetValueById("txtPagaCon")),
      Vuelto: Number(GetValueById("txtVueltoFact"))
    };

    objFactura.Pago = nodeMedioPago;
    objFactura.Observaciones = observaciones;

    console.log(objFactura);
    onSet_ObjectJson(objFactura);
    onSave_Factura(objFactura);
  };

  const onSave_Factura = async (documentoJson) => {
    try {
      const response = await fetch('/api/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentoJson)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onClose();
        toast.success('Factura registrada satisfactoriamente');
        setTimeout(() => {
          objFactura.Consecutivo = data.id;
          onReload(objFactura);
          onSelect_MedioPago("");
          onModal_Print(true);
        }, 500);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toast.error("Sucedió un error registrar la factura", error);
      console.error(error);
    }
  };

  useEffect(() => {
    setVuelto(0);
    setFaltante(0);
    if (objFactura) {
      setObservaciones("Dirección: " + objFactura.Receptor.Direccion.DireccionExacta + "\n");
    }
  }, [open, objFactura]); 
  

  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-opacity ${open ? "visible bg-black bg-opacity-40 dark:bg-opacity-50" : "invisible"}`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"} max-w-3xl w-full md:w-2/3 lg:w-6/12`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
          <X size={20} strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold flex gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
              <Coins />Confirmar Pago
            </h2>
            <hr className="my-3 py-0.5 border-black dark:border-white" />
          </div>
          <div className="grid gap-4 mb-4 grid-cols-3">
            <HtmlFormInput value={"₡ " + (objFactura ? objFactura.Total : 0)} disabled={true} colSize={1} legend={"Monto Total"} />
            <HtmlFormSelect legend={"Medio de Pago"} options={mediosPago} colSize={1} id={"selMedioPago"} onChange={onChange_MedioPago} />
            <HtmlFormInput id={"txtPagaCon"} type={"number"} disabled={disableFields} onChange={onChange_PagaConInput} value={pagaCon} colSize={1} legend={"Paga Con"} />
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <HtmlFormInput id={"txtVueltoFact"} disabled={true} type={"number"} value={vuelto} colSize={1} legend={"Vuelto"} />
            <HtmlFormInput id={"txtFaltanteFact"} disabled={true} type={"number"} value={faltante} colSize={6} legend={"Faltante"} />
          </div>

          <div className="grid gap-4 mb-4 w-full">
            <HtmlTextArea
              onChange={onChange_Observaciones}
              value={observaciones}
              colSize={1}
              id={"txtObservaciones"}
              legend={"Observaciones"}
            />
          </div>

          <div className="grid gap-4 mt-4 grid-cols-4">
            <div className={`col-span-2`}>
              {showBtn && (
                <HtmlButton colSize={2} legend={"Facturar"} icon={File} color={"blue"} onClick={onValidate_GuardarFact} />
              )}
            </div>
            <div className={`col-span-2`}>
              <HtmlButton colSize={2} legend={"Cancelar"} icon={XCircle} color={"red"} onClick={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
