import { FormatDate, FormatDate12Hours, FormatOnlyDate } from "@/app/api/utils/js-helpers";
import React from "react";

const TicketMovimiento = React.forwardRef(function TicketMovimiento({ item }, ref) {
   return (
      <div
         ref={ref}
         style={{
            width: "80mm",
            padding: "5mm",
            fontSize: "12px",
            fontFamily: "Tahoma, sans-serif",
           
         }}
      >
         <h1
            style={{
               fontSize: "14px",
               marginBottom: "5mm",
               textAlign: "center",
               borderBottom: "1px solid #000",
               paddingBottom: "3mm",
            }}
         >
            Comprobante de Movimiento
         </h1>
         <table
            style={{
               width: "100%",
               borderCollapse: "collapse",
               fontSize: "12px",
            }}
         >
            <tbody>
               <tr>
                  <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>
                     <strong>No. Movimiento:</strong>
                  </td>
                  <td style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>
                     {item.idMovimiento}
                  </td>
               </tr>
               <tr>
                  <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>
                     <strong>Fecha Creación:</strong>
                  </td>
                  <td style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>
                     {FormatDate12Hours(item.fechaCreacion)}
                  </td>
               </tr>
               <tr>
                  <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>
                     <strong>Estado:</strong>
                  </td>
                  <td style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>
                     {item.EstadoMovimiento.nombre}
                  </td>
               </tr>
               <tr>
                  <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>
                     <strong>Tipo:</strong>
                  </td>
                  <td style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>
                     {item.TipoMovimiento.nombre} de Dinero
                  </td>
               </tr>
               <tr>
                  <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>
                     <strong>Monto:</strong>
                  </td>
                  <td
                     style={{
                        textAlign: "right",
                        padding: "4px",
                        borderBottom: "1px solid #ddd",
                        color: item.EstadoMovimiento.nombre === "Anulado" ? "red" : "black",
                     }}
                  >
                     {item.EstadoMovimiento.nombre !== "Anulado"
                        ? `₡ ${Number(item.monto).toFixed(2)}`
                        : "COMPROBANTE SIN VALIDEZ"}
                  </td>
               </tr>
            </tbody>
         </table>
         <hr style={{ margin: "5mm 0" }} />
         <p style={{ textAlign: "center", fontSize: "10px", margin: "3mm 0 0" }}>
            <strong>Impreso el:</strong> {FormatDate12Hours(new Date())}
         </p>
         <hr style={{ margin: "5mm 0" }} />
         {item.EstadoMovimiento.nombre === "Anulado" ? (
            <p
               style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "red",
                  fontSize: "12px",
               }}
            >
               ***MOVIMIENTO NO TIENE VALIDEZ***
            </p>
         ) : null}
      </div>
   );
});

export default TicketMovimiento;
