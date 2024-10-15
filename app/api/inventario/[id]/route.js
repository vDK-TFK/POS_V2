import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
  try {
    const producto = await db.productos.findUnique({
      where: {
        ProductoID: Number(params.id), 
      }
    });

    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const data = await request.json();

  try {
    const updateData = {
      ...data,
      FechaIngreso: data.FechaIngreso ? new Date(data.FechaIngreso).toISOString() : undefined,
      FechaCaducidad: data.FechaCaducidad ? new Date(data.FechaCaducidad).toISOString() : undefined,
    };

    const productoActualizado = await db.productos.update({
      where: {
        ProductoID: Number(params.id),
      },
      data: updateData,
    });

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const producto = await db.productos.findUnique({
      where: {
        ProductoID: Number(params.id),
      }
    });

    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const productoEliminado = await db.productos.delete({
      where: {
        ProductoID: Number(params.id),
      }
    });

    return NextResponse.json(productoEliminado);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
