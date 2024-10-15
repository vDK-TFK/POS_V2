import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

//Obtener las categorias de productos a la venta
export async function GET() {
  const categorias = await prisma.categoriaProdVenta.findMany();
  return NextResponse.json(categorias);
}