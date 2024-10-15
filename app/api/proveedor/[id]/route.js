import { NextResponse } from 'next/server';
import db from '@/app/lib/db'

export async function GET(request, { params }) {
  console.log(params.id)

  const proveedores = await db.proveedores.findUnique({
    where: {
      ProveedorID: Number(params.id), // Utiliza el nombre correcto del campo de identificación
    }
  });
  console.log(proveedores)
  return NextResponse.json(proveedores);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const proveedorActualizado = await db.proveedores.update({
    where: {
      ProveedorID: Number(params.id), // Utiliza el nombre correcto del campo de identificación
    },
    data: data,
  });
  return NextResponse.json(proveedorActualizado);
}

export async function DELETE(request, { params }) {
  try {
    const proveedor = await db.proveedores.findUnique({
      where: {
        ProveedorID: Number(params.id),
      }
    });

    if (!proveedor) {
      return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 });
    }

    const proveedores = await db.proveedores.delete({
      where: {
        ProveedorID: Number(params.id),
      }
    });

    console.log(proveedores)
    return NextResponse.json(proveedores);
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    return NextResponse.json({ error: 'Error al eliminar el proveedor' }, { status: 500 });
  }
}
