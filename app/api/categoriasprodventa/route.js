import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

//Obtener las categorias de productos a la venta
export async function GET() {
  try {
    const listaCategorias = await prisma.categoriaProdVenta.findMany();

    if (listaCategorias.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron registros.",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: listaCategorias,
      message: "Se han obtenido las categorías",
    });
  } 
  catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        message: "Error al obtener los datos: " + error.message,
      }
    );
  }
  



}