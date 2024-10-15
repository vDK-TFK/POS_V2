import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function insertManyDetallesFactura(detalles, idFactura, prisma) {
  if (!Array.isArray(detalles)) {
    throw new Error('El parámetro detalles debe ser un array');
  }

  const result = await prisma.detallesFactura.createMany({
    data: detalles.map(detalle => ({
      idFactura: idFactura,
      cantidad: detalle.Cantidad,
      descripcion: detalle.Descripcion,
      precio: detalle.Precio,
      idProductoVenta: detalle.IdProductoVenta,
    })),
  });

  return result;
}

export async function POST(request) {
  try {
    const d = await request.json();
    const r = d.Receptor;

    console.log("JSON: " + JSON.stringify(d));

    const medioPago = d.Pago.IdMedioPago;
    const estadoFac = medioPago === "3" ? 'ACTIVA' : 'PAGADA';

    const facturaData = {
      clienteId: r.ClienteId,
      fechaEmision: new Date(d.FechaEmision),
      documentoJson: JSON.stringify(d),
      observaciones: d.Observaciones,
      idMedioPago: parseInt(medioPago, 10),
      total: parseFloat(d.Total),
      pagadoCon: parseFloat(d.Pago.PagaCon),
      vuelto: parseFloat(d.Pago.Vuelto),
      idInfoCaja:d.idInfoCaja,
      estadoFac: estadoFac, 
    };

    const detallesData = d.Detalles.map(item => ({
      cantidad: item.Cantidad,
      descripcion: item.Descripcion,
      precio: item.Precio,
      idProductoVenta: item.IdProductoVenta,
    }));

    const result = await prisma.$transaction(async (prisma) => {
      const factura = await prisma.facturas.create({ data: facturaData });
      
      await prisma.detallesFactura.createMany({
        data: detallesData.map(detalle => ({
          ...detalle,
          idFactura: factura.idFactura
        }))
      });

      for (const detalle of detallesData) {
        await prisma.productoVenta.update({
          where: {
            idProductoVenta: detalle.idProductoVenta
          },
          data: {
            cantidad: {
              decrement: detalle.cantidad
            }
          }
        });
      }

      return factura;
    });

    return NextResponse.json({ id: result.idFactura });
  } 
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
  finally {
    await prisma.$disconnect();
  }
}
