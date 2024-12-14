import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const producto = await prisma.productos.findUnique({
      where: {
        ProductoID: Number(params.id),
      },
    });

    if (!producto) {
      return NextResponse.json(
        { code: 404, status: 'error', message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 200,
      status: 'success',
      data: producto,
      message: 'Producto obtenido satisfactoriamente',
    });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { code: 500, status: 'error', message: `Error al obtener el producto: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const productoActualizado = await prisma.productos.update({
      where: {
        ProductoID: Number(params.id),
      },
      data: {
        ...data,
        FechaIngreso: data.FechaIngreso ? new Date(data.FechaIngreso) : null,
        FechaCaducidad: data.FechaCaducidad ? new Date(data.FechaCaducidad) : null,
        IdUsuarioModificacion: data.IdUsuarioModificacion, // ID del usuario que modifica
        FechaModificacion: new Date(), // Fecha de modificación
      },
    });

    return NextResponse.json({
      code: 200,
      status: 'success',
      data: productoActualizado,
      message: 'Producto actualizado satisfactoriamente',
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json(
      { code: 500, status: 'error', message: `Error al actualizar el producto: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const productoId = Number(params.id);

    // Aquí deberías realizar la actualización lógica para marcar el producto como eliminado
    const producto = await prisma.productos.update({
      where: { ProductoID: productoId },
      data: { Eliminado: true },
    });

    return new Response(JSON.stringify({
      status: "success",
      message: "Producto eliminado satisfactoriamente.",
    }), { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);

    return new Response(JSON.stringify({
      status: "error",
      message: `Error al eliminar el producto: ${error.message}`,
    }), { status: 500 });
  }
}

