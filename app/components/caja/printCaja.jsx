import { FormatCurrency, FormatDate12Hours, FormatOnlyDate } from '@/app/api/utils/js-helpers';
import React from 'react';

const TicketCaja = React.forwardRef(function TicketCaja({ item }, ref) {
    return (
        <div
            ref={ref}
            style={{
                width: '80mm',
                padding: '5mm',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                
            }}
        >
            <h1
                style={{
                    fontSize: '14px',
                    textAlign: 'center',
                    fontFamily:'tahoma',
                }}
            >
                <strong>REPORTE CIERRE DE CAJA</strong>
            </h1>
            <hr style={{ margin: '3mm 0' }} />
            <div>
                <p style={{ fontFamily:'tahoma' }}>
                    <strong>Caja No. </strong> {item.idInfoCaja}
                </p>
                <p style={{ fontFamily: 'tahoma' }}>
                    <strong>Apertura:</strong> {FormatDate12Hours(item.fechaApertura)}
                </p>
                <p style={{ fontFamily: 'tahoma' }}>
                    <strong>Cierre:</strong> {FormatDate12Hours(item.fechaCierre)}
                </p>

                <hr style={{ margin: '3mm 0' }} />
                <h1
                    style={{
                        fontSize: '14px',
                        textAlign: 'center',
                        fontFamily: 'tahoma'
                    }}
                >
                    <strong>DETALLES</strong>
                </h1>
                <table
                    style={{
                        width: '100%',
                        border: '1px solid #000', // Borde sólido y ligero
                        borderCollapse: 'collapse', // Evita espacios entre celdas
                    }}
                >
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                <strong>Total Facturado:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                ₡{FormatCurrency(item.totalFacturado)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                <strong>Monto Inicial Caja:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                ₡{FormatCurrency(item.montoInicioCaja)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                <strong>Monto Cierre Caja:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                ₡{FormatCurrency(item.montoCierreCaja)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                <strong>Total Entradas:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                ₡{FormatCurrency(item.totalEntradas)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                <strong>Total Salidas:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm', borderBottom: '1px solid #ddd' }}>
                                ₡{FormatCurrency(item.totalSalidas)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'tahoma', padding: '2mm' }}>
                                <strong>Diferencia:</strong>
                            </td>
                            <td style={{ fontFamily: 'tahoma', textAlign: 'right', padding: '2mm' }}>
                                ₡{item.diferencia}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr style={{ margin: '3mm 0' }} />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>
                Impreso el {FormatDate12Hours(new Date())}
            </p>
        </div>
    );
});

export default TicketCaja;
