import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function POST(request) {
  try {
    
    const model = await request.json();
  console.log(model);
    const listaFacturas = await prisma.facturas.findMany({
      select: {
        idFactura: true,
        nombreCliente: true,
        fechaEmision: true,
        estadoFac: true,
        medioPago: true,
        total: true,
        estadoFac: true,
      },
      where: {
        fechaEmision: {
          gte: model.fechaInicial,
          lte: model.fechaFinal,
        },
        ...(model.estadoFac ? { estadoFac: model.estadoFac } : {}),
        ...(model.idMedioPago ? { idMedioPago: Number(model.idMedioPago) } : {}),
      },
    });

    if (listaFacturas.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se han encontrado facturas",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: listaFacturas,
      message: "Se han obtenido las facturas",
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        message: "Error al obtener los datos: " + error.message,
      },
    );
  }
}
