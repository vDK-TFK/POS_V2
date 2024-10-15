import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET() {
  try {
    const detalles = await db.detallesFactura.findMany({
      include: {
        fk_factura: {
          include: {
            cliente: true, 
          }
        },
        fk_productoVenta: true 
      }
    });

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return NextResponse.json({ error: 'No se encontraron detalles de factura' }, { status: 404 });
    }

    const agrupadoPorFactura = detalles.reduce((acc, detalle) => {
      if (!acc[detalle.idFactura]) {
        acc[detalle.idFactura] = {
          idFactura: detalle.fk_factura.idFactura,
          fechaEmision: detalle.fk_factura.fechaEmision,
          cliente: detalle.fk_factura.cliente,
          total: detalle.fk_factura.total,
          idMedioPago: detalle.fk_factura.idMedioPago,
          estadoFac: detalle.fk_factura.estadoFac,
          detalles: [] // Inicializa una lista de detalles
        };
      }

      acc[detalle.idFactura].detalles.push({
        idDetalleFactura: detalle.idDetalleFactura,
        cantidad: detalle.cantidad,
        descripcion: detalle.descripcion,
        precio: detalle.precio,
        producto: {
          nombre: detalle.fk_productoVenta.nombre,
          cantidad: detalle.fk_productoVenta.cantidad
        }
      });

      return acc;
    }, {});

    const resultados = Object.values(agrupadoPorFactura);

    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Error al obtener los detalles de factura:', error.message || error);
    return NextResponse.json({ error: 'Error al obtener los detalles de factura' }, { status: 500 });
  }
}
