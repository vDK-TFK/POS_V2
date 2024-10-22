import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const model = await request.json();
    const emisor = model.Emisor;
    const receptor = model.Receptor;
    const pago = model.Pago;
    const medioPago = pago.IdMedioPago;
    const estadoFac = medioPago == "3" ? "ACTIVA" : "PAGADA";

    //Model Factura
    const nuevaFactura = {
      idCliente: receptor.IdCliente,
      nombreCliente: receptor.Nombre,
      documentoJson: JSON.stringify(model),
      observaciones: model.Observaciones,
      medioPago: pago.DescripcionMedioPago,
      idMedioPago: pago.IdMedioPago,
      total: parseFloat(pago.MontoFactura),
      pagadoCon: parseFloat(pago.PagaCon),
      vuelto: parseFloat(pago.Vuelto),
      idInfoCaja: model.NumeroCaja,
      idUsuarioCreacion: model.idUsuarioCreacion,
      estadoFac: estadoFac,
    };

    const detalles = model.Detalles.map((item) => ({
      cantidad: item.Cantidad,
      descripcion: item.Descripcion,
      precio: item.Precio,
      idProductoVenta: item.IdProductoVenta,
      noRebajaInventario: item.NoRebajaInventario,
    }));

    const result = await prisma.$transaction(async (prisma) => {
      //Inserta la factura
      const factura = await prisma.facturas.create({ data: nuevaFactura });

      //Inserta los detalles de la factura
      await prisma.detallesFactura.createMany({
        data: detalles.map((detalle) => ({
          ...detalle,
          idFactura: factura.idFactura,
        })),
      });

      //Rebaja las cantidades a los productos que rebajan
      for (const item of detalles) {
        if (!item.noRebajaInventario) {
          await prisma.productoVenta.update({
            where: {
              idProductoVenta: item.idProductoVenta,
            },
            data: {
              cantidad: {
                decrement: item.cantidad,
              },
            },
          });
        }
      }

      return factura;
    });

    return NextResponse.json({
      code: 200,
      status: "success",
      data: result.idFactura,
      message: "Factura registrada satisfactoriamente",
    });
  } 
  catch (error) {
    console.error("Error al generar la factura:", error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al generar la facturas: " + error.message,
    });
  } 
  finally {
    await prisma.$disconnect();
  }
}
