import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

//Cliente o clientes a facturar
export async function GET(req) {
  const url = new URL(req.url);
  const value = decodeURIComponent(url.pathname.split("/").pop());

  try {
    const clientesFactura = await prisma.clientes.findMany({
      where: {
        ...(value !== "Todos" && {
          nombreCompleto: {
            contains: value,
          },
        }),
        eliminado: false,
      },
    });

    if (clientesFactura.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontró el cliente o clientes, proceda a crearlo",
        data: [],
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: clientesFactura,
      message: "",
    });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al obtener los datos: " + error.message,
    });
  }
}