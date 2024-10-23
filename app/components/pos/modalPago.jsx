import { GetHtmlValueById, GetValueById } from "@/app/api/utils/js-helpers";
import { Coins, File, Send, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import HtmlButton from "../HtmlHelpers/Button";
import HtmlFormInput from "../HtmlHelpers/FormInput";
import HtmlFormSelect from "../HtmlHelpers/FormSelect";
import HtmlTextArea from "../HtmlHelpers/TextArea";
import { ClipLoader } from "react-spinners";

export default function ModalRegistrarPago({ open, onClose, objFactura, onReload }) {
  const [disableFields, onDisable_Fields] = useState(true);
  const [hideFields, onHide_Fields] = useState(true);
  const [showBtn, onShow_Btn] = useState(false);
  const [modalPrint, onModal_Print] = useState(false);
  const [objectJson, onSet_ObjectJson] = useState(null);
  const [onLoading, onSet_Loading] = useState(false);
  const ticketRef = useRef();
  const [itemToPrint,onSet_ItemToPrint] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    montoTotal: "",
    medioPago: "",
    pagaCon: 0,
    vuelto: 0,
    faltante:0,
    observaciones:""
  });

  // Manejador de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    const value = Number(event.target.value);
    onChange_PagaCon(value);
    
  };

  const onChange_PagaCon = (value) => {
    const total = objFactura.Total ?? 0;
    
    if (isNaN(value) || value < 0) {
      formData.pagaCon = 0;
      formData.vuelto = 0;
      formData.faltante = 0;
      return;
    }

    //Si existe un vuelto
    if (value > total) {
      formData.vuelto = (value - total);
      formData.faltante = 0;
      onShow_Btn(true);
    } 
    //Si existe faltante
    else if (value < total) {
      formData.faltante = ((total - value) * -1);
      formData.vuelto = 0;
      onShow_Btn(false);
    }
    //Pago total sin vuelto ni faltante 
    else {
      formData.vuelto = 0;
      formData.faltante = 0;
      onShow_Btn(true);
    }
  };

  const onChange_MedioPago = (event) => {
    const medioPago = event.target.value;
    formData.pagaCon = objFactura.Total
    onHideShow_Inputs(medioPago)

  };

  const onHideShow_Inputs = (val) => {
    if (val === "") {
      formData.pagaCon = 0;
      formData.vuelto = 0;
      formData.faltante = 0;
      onHide_Fields(true);
      onShow_Btn(false);
    } 
    else if (val == "2" || val == "3") {
      formData.pagaCon = objFactura.Total ?? 0;
      formData.vuelto = 0;
      formData.faltante = 0;
      onDisable_Fields(true);
      onHide_Fields(true);
      onShow_Btn(true);
    } 
    else {
      formData.pagaCon = objFactura.Total ?? 0;
      onHide_Fields(false);
      onShow_Btn(true);
      onDisable_Fields(false);
    }
  };

  const onGet_MedioPago = (id) => {
    const medio = listaMediosPago.find((m) => m.IdMedioPago === Number(id));
    return medio ? medio.Nombre : 'N/A';
  };

  const onValidate_GuardarFact = () => {
    let nodeMedioPago = {
      IdMedioPago: Number(formData.medioPago),
      DescripcionMedioPago: onGet_MedioPago(formData.medioPago),
      MontoFactura: Number(objFactura.Total ?? 0),
      PagaCon: Number(formData.pagaCon),
      Vuelto: Number(formData.vuelto),
    };

    objFactura.Pago = nodeMedioPago;
    objFactura.Observaciones = formData.observaciones;

    console.log(objFactura);
    onSet_ObjectJson(objFactura);
    onSave_Factura(objFactura);
  };

  const onSave_Factura = async (documentoJson) => {
    onSet_Loading(true);
    try {
      const response = await fetch('/api/facturar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentoJson)
      });

      const result = await response.json();

      if(result.status == "success"){
        toast.success(result.message);
        objFactura.Consecutivo = Number(result.data)
        onClose();
        onReload(objFactura);
        //onModal_Print(true);
      }
      else{
        toast.error(result.message);
      }
    } 
    catch (error) {
      console.error('Error al registrar la factura:', error);
      toast.error("Error al registrar la factura: " + error);
    }
    finally{
      onSet_Loading(false);
    }
  };



  useEffect(() => {
    
    if (objFactura) {
      setFormData({
        montoTotal: "₡" + objFactura.Total,
        medioPago: "",
        pagaCon: 0,
        vuelto: 0,
        faltante: 0,
        observaciones: "Dirección: " + objFactura.Receptor.Direccion
      });
    }


  }, [open, objFactura]); 
  

  if (!open) {
    return null;
  }

  return (
    <div
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
          <form method="POST" action={onValidate_GuardarFact} className="my-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
              <HtmlFormInput value={formData.montoTotal} name={"montoTotal"} onChange={handleChange} disabled={true} colSize={1} legend={"Monto Total"} />
              <HtmlFormSelect legend={"Medio de Pago"} selectedValue={formData.medioPago} options={mediosPago} colSize={1} name={"medioPago"} onChange={(e) => {onChange_MedioPago(e),handleChange(e)}} />
              <HtmlFormInput name={"pagaCon"} value={formData.pagaCon} type={"number"} disabled={disableFields} onChange={(e) => { onChange_PagaConInput(e), handleChange(e) }} colSize={1} legend={"Paga Con"} />
            </div>
            {
              !hideFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
                  <HtmlFormInput name={"vuelto"} disabled={true} type={"number"} onChange={handleChange} value={formData.vuelto} colSize={1} legend={"Vuelto"} />
                  <HtmlFormInput name={"faltante"} disabled={true} type={"number"} onChange={handleChange} value={formData.faltante} colSize={1} legend={"Faltante"} />
                </div>
              )
            }


              <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
                <HtmlTextArea
                  onChange={handleChange}
                  name={"observaciones"}
                  value={formData.observaciones}
                  colSize={1}
                  legend={"Observaciones"}
                />
              </div>
            <div className="flex justify-center gap-6 mt-5">
              {onLoading ? (
                <div className="flex items-center justify-center m-1">
                  <ClipLoader size={30} speedMultiplier={1.5} />
                </div>
              ) : (
                <>
                {
                  showBtn && (
                    <HtmlButton type="submit" legend={"Facturar"} color={"green"} icon={Send} />
                  )
                }
                  <HtmlButton type="button" legend={"Cancelar"} color={"gray"} icon={X} onClick={onClose} />
                </>
              )}
            </div>
            </form>
        </div>
      </div>
      
    </div>
    
  );
}
