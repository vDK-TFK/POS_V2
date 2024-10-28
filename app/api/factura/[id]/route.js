import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Buscar json de factura
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const factura = await prisma.facturas.findUnique({
      select: {
        idFactura: true,
        documentoJson: true,
      },
      where: {
        idFactura: Number(id),
      },
    });

    if (!factura) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron registros.",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: factura,
      message: "Se ha obtenido la factura",
    });
  } catch (error) {
    console.error("Error al obtener la factura:", error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al obtener la factura: " + error.message,
    });
  }
}

//Anular o pagar
export async function PUT(request) {
  try {
    const model = await request.json();
    const isCancelAction = model.action === "cancel";
    const estadoFac = isCancelAction ? "NULA" : "PAGADA";

    console.log(model);

    const facturaAnulada = await prisma.facturas.update({
      data: {
        estadoFac,
        idUsuarioModificacion: Number(model.idUsuarioModificacion),
        fechaModificacion: new Date(),
      },
      where: {
        idFactura: Number(model.id),
      },
    });

    if (!facturaAnulada) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: `Error al ${
          isCancelAction ? "anular" : "validar el pago de"
        } la factura.`,
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: facturaAnulada,
      message: `Documento ${
        isCancelAction ? "anulado" : "pagado"
      } correctamente.`,
    });
  } catch (error) {
    console.error(
      `Error al ${
        model.action === "cancel" ? "anular" : "validar el pago de"
      } la factura:`,
      error
    );
    return NextResponse.json({
      code: 500,
      status: "error",
      message: `Error al ${
        model.action === "cancel" ? "anular" : "validar el pago de"
      } la factura: ${error.message}`,
    });
  }
}
