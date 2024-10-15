import { X } from "lucide-react";

export default function PrintTicket({ open, onClose, json }) {

    function imprimirFactura() {
        const contenidoModal = document.querySelector('#modalContent').innerHTML;
        const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('');
                } catch (e) {
                    return '';
                }
            })
            .join('');

        const ventanaImpresion = window.open('', '_blank');
        onClose();
        
        ventanaImpresion.document.write('<html><head><title>Impresión de Factura</title>');
        ventanaImpresion.document.write('<style>' + styles + '</style>');
        ventanaImpresion.document.write('<style>@media print { .no-imprimir { display: none; } body { margin: 0; padding: 0; width: 80mm; height: auto; } table { width: 100%; } td, th { word-wrap: break-word; white-space: normal; }}</style>');
        ventanaImpresion.document.write('</head><body>');
        ventanaImpresion.document.write(contenidoModal);
        ventanaImpresion.document.write('</body></html>');
        
        ventanaImpresion.document.close();
        ventanaImpresion.focus();
        ventanaImpresion.print();
        ventanaImpresion.close();
    }

    if (json) {
        return (
            <div id="modalPrintTicket" onClick={onClose} className={`fixed inset-0 flex items-center justify-center ${open ? "visible bg-black bg-opacity-30 dark:bg-opacity-50" : "invisible"}`}>
                <div onClick={(e) => e.stopPropagation()} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-80 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} transition-transform transition-opacity`}>
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 no-imprimir">
                        <X />
                    </button>
                    <div id="modalContent" className="text-center">
                        <h2 className="text-md text-center font-extrabold dark:text-white">{json.Emisor.Nombre}</h2>
                        <h3 className="text-sm text-center dark:text-white">{json.Emisor.NombreComercial}</h3>
                        <h3 className="text-sm text-center dark:text-white"><strong>Email:</strong> {json.Emisor.Correo}</h3>
                        <h3 className="text-sm text-center dark:text-white"><strong>Cédula:</strong> {json.Emisor.Identificacion}</h3>
                        <h3 className="text-sm text-center dark:text-white"><strong>Telfs:</strong> {json.Emisor.Telefono} / {json.Emisor.Celular}</h3>
                        <hr className="my-2 border-gray-300 dark:border-gray-300" />

                        <div className="dark:text-gray-300">
                            <div className="text-md text-left"><strong>Fact. No:</strong> {json.Consecutivo.toString().padStart(6, '0')}</div>
                            <div className="text-md text-left"><strong>Fecha de Emisión:</strong> {new Date(json.FechaEmision).toLocaleDateString()}</div>
                            
                            <div className="text-md text-left"><strong>Cliente:</strong> {json.Receptor.Nombre}</div>
                        </div>

                        <hr className="my-2 border-gray-300 dark:border-gray-300" />
                        <div className="overflow-x-auto">
                            <div style={{ overflowY: 'auto', maxHeight:'200px' }} className="flex justify-center">
                                <table className="table-auto max-w-lg border-collapse text-md w-full">
                                    <thead>
                                        <tr className="">
                                            <th className="dark:text-gray-300 px-1 py-1 border-gray-300 text-center text-sm">#</th>
                                            <th className="dark:text-gray-300 px-2 py-1 border-gray-300 text-center text-sm">Cant.</th>
                                            <th className="dark:text-gray-300 px-8 py-1 border-gray-300 text-left text-sm">Descripción</th>
                                            <th className="dark:text-gray-300 px-2 py-1 text-left text-sm">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {json.Detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td className="dark:text-gray-300 px-2 py-1 text-center"><strong>{detalle.NumeroLinea}</strong></td>
                                                <td className="dark:text-gray-300 px-2 py-1 text-center">{detalle.Cantidad}</td>
                                                <td className="dark:text-gray-300 px-2 py-1 text-left" style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'normal' }}>
                                                    {detalle.Descripcion}
                                                </td>
                                                <td className="dark:text-gray-300 px-2 py-1 text-left">₡{detalle.Precio}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    
                                </table>
                            </div>
                            <hr className="my-1 border-gray-300 dark:border-gray-300" />
                            <div className="text-left dark:text-gray-300 px-2 py-1 border-gray-300"><strong>TOTAL: ₡{json.Total} </strong><br/>
                              <span className="mt-2 text-sm"><strong>Paga con:</strong> ₡{json.Pago.PagaCon} en <strong>{json.Pago.DescripcionMedioPago}</strong> </span><br/>
                              <span className="mt-2 text-sm"><strong>Vuelto:</strong> ₡{json.Pago.Vuelto}</span>
                            </div>
                            <hr className="my-1 border-gray-300 dark:border-gray-300" />
                            <div className="text-sm dark:text-gray-300">
                                <div className="text-left"><strong>Observaciones:</strong><br /> {!json.Observaciones ? 'N/A' : json.Observaciones}</div>
                                <div className="text-left text-xs mt-1"><strong>Telfs Cliente:</strong>{json.Receptor.Telefono} / {json.Receptor.Celular}</div>
                                <div className="text-center text-xs mt-3"><strong>-----GRACIAS POR SU COMPRA-----</strong></div>
                                <br />
                                <div className="text-center text-xs"><strong>Régimen tributario simplificado</strong><br />
                                    <span className="text-center text-xs">Autorizado Mediante Oficio 11-97 del 12 de Agosto de 1997</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={imprimirFactura} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-imprimir mt-4">Imprimir</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}
