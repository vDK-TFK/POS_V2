import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET() {
  try {
    const categorias = await db.categoriasProducto.findMany();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return NextResponse.json({ error: 'Error al obtener las categorías' }, { status: 500 });
  }
}

export async function POST(request) {
  const data = await request.json();
  try {
    const nuevaCategoria = await db.categoriasProducto.create({
      data: {
        NombreCategoria: data.nombreCategoria,
        Descripcion: data.descripcion,
      },
    });
    return NextResponse.json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return NextResponse.json({ error: 'Error al crear la categoría' }, { status: 500 });
  }
}
