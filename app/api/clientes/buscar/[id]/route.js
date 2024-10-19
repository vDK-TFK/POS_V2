import { FindWithLike } from "@/app/api/utils/db-methods";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient()


export async function GET(req) {
  const url = new URL(req.url);
  const value = decodeURIComponent(url.pathname.split('/').pop());

  console.log(value)

  if (value) {
    try {
        const results = await prisma.clientes.findMany({
        where: {
            nombreCompleto: {
                contains: value,
            },
            eliminado:false
        },
        });

        console.log(results)


        return NextResponse.json(results);
    } 
    catch (error) {
      console.error('Error en la búsqueda:', error);
      return NextResponse.json({ error: 'Error al buscar datos' }, { status: 500 });
    }
  } 
  else {
    return NextResponse.json({ error: 'No existe el valor a buscar en la URL' }, { status: 400 });
  }
}