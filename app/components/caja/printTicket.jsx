import { FormatDate, FormatOnlyDate } from "@/app/api/utils/js-helpers";
import React from 'react';

const TicketMovimiento = React.forwardRef(function TicketMovimiento({ item }, ref) {
   return (
      <div ref={ref} style={{ width: '80mm', height: '80mm', padding: '5mm', fontSize: '12px', fontFamily: 'monospace' }}>
         <h1 style={{ fontSize: '12px', marginBottom: '3mm' }}>Comprobante de Movimiento</h1>
         <p><strong>No. Movimiento:</strong> {item.idMovimiento}</p>
         <p><strong>Fecha Creación:</strong> {FormatOnlyDate(item.fechaCreacion)}</p>
         <p><strong>Estado:</strong> {item.EstadoMovimiento.nombre}</p>
         <p><strong>Tipo:</strong> {item.TipoMovimiento.nombre} de Dinero</p>
         {
            item.EstadoMovimiento.nombre !== "Anulado" ? (
               <p><strong>Monto:</strong> ₡ {item.monto}</p>
            ) : (
               <p><strong>Monto: COMPROBANTE SIN VALIDEZ</strong></p>
            )
         }
         <hr />
         <p style={{ marginTop: '3mm' }}>¡Gracias por su transacción!</p>
         <p style={{ marginTop: '3mm' }}><strong>Impreso el:</strong> {FormatDate(new Date())}</p>
         <hr />
         {
            item.EstadoMovimiento.nombre === "Anulado" ? (
               <p><strong>***COMPROBANTE DE MOVIMIENTO ANULADO***</strong></p>
            ) : null
         }
      </div>
   );
});

export default TicketMovimiento;
