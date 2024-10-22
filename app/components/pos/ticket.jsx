import React from 'react';

const TicketFactura = React.forwardRef(function TicketFactura({ item }, ref) {
    return (
        <>
            <div ref={ref} style={{ width: '80mm', height: '80mm', padding: '5mm', fontSize: '12px', fontFamily: 'Tahoma' }}>
                <div className="w-full text-left flex items-start">
                    <div className="flex-shrink-0">
                        <img
                            className="w-20 h-20 bg-cover bg-no-repeat profile-img"
                            alt=""
                            src={item.LogoSource}
                        />
                    </div>
                    <div className="ml-4 flex flex-col">
                        <div className="uppercase break-words text-sm">
                            <strong>{item.Emisor.Nombre}</strong>
                        </div>
                        <div className="break-words text-xs">
                            Nombre Comercial: {item.Emisor.NombreComercial}
                        </div>
                        <div className="break-words text-xs">
                            Correo: {item.Emisor.Correo}
                        </div>
                        <div className="break-words text-xs">
                            Cédula: {item.Emisor.Identificacion}
                        </div>
                        <div className="break-words text-xs">
                            Teléfonos: {item.Emisor.Telefono} / {item.Emisor.Celular}
                        </div>
                    </div>
                </div>

                <hr className="mt-3 mb-3" />

                <div className="break-words text-sm">
                    <strong>Fact. No: </strong>{item.Consecutivo.toString().padStart(6, '0')}
                </div>
                <div className="break-words text-sm">
                    <strong>Fecha de Emisión: </strong>{new Date(item.FechaEmision).toLocaleDateString()}
                </div>
                <div className="break-words text-sm">
                    <strong>Cliente: </strong>{item.Receptor.Nombre}
                </div>

                <hr className="mt-3 mb-3" />

                <div style={{ overflowY: 'auto', maxHeight: '200px' }} className="flex justify-center">
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
                            {item.Detalles.map((detalle, index) => (
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

                <hr className="mt-3 mb-3" />

                <div className="m-2 uppercase break-words text-sm">
                    <strong>Total:</strong> ₡{item.Pago.MontoFactura}
                </div>

                <div className="uppercase m-2 break-words text-md">
                    <strong>Paga con:</strong> ₡{item.Pago.PagaCon} en {item.Pago.DescripcionMedioPago}
                </div>

                <div className="uppercase m-2 break-words text-md">
                    <strong>Vuelto:</strong>₡{item.Pago.Vuelto}
                </div>

                <hr className="mt-3 mb-3" />

                <div className="m-2 break-words text-sm">
                    <strong>Observaciones:</strong>
                    <p className='text-xs'>{item.Observaciones}</p>
                </div>

                <div className="m-3 break-words text-xs">
                    <strong>Teléfonos Cliente:</strong>
                    <p className='text-xs'>{item.Receptor.Telefono} // {item.Receptor.Celular}</p>
                </div>

                <div style={{ fontSize: "10px" }} className="m-2 break-words text-xs">
                    Impreso el: {new Date().toLocaleDateString()}
                </div>

                <div className="mt-2 items-center break-words text-xs text-center">
                    <strong>------GRACIAS POR SU COMPRA------</strong>
                </div>

                <div className="mt-4 text-center text-xs"><strong>Régimen tributario simplificado</strong><br />
                    <span className="text-center text-xs">Autorizado Mediante Oficio 11-97 del 12 de Agosto de 1997</span>
                </div>


            </div>
        </>
    );
});

export default TicketFactura;




