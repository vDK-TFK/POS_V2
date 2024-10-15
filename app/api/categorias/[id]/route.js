import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
  try {
    const categoria = await db.categoriasProducto.findUnique({
      where: {
        CategoriaProductoID: Number(params.id),
      },
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    return NextResponse.json({ error: 'Error al obtener la categoría' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const categoriaActualizada = await db.categoriasProducto.update({
      where: {
        CategoriaProductoID: Number(params.id),
      },
      data: data,
    });

    return NextResponse.json(categoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const categoria = await db.categoriasProducto.findUnique({
      where: {
        CategoriaProductoID: Number(params.id),
      },
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    const categoriaEliminada = await db.categoriasProducto.delete({
      where: {
        CategoriaProductoID: Number(params.id),
      },
    });

    return NextResponse.json(categoriaEliminada);
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return NextResponse.json({ error: 'Error al eliminar la categoría' }, { status: 500 });
  }
}
