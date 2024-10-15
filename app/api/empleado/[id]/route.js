import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
  const usuario = await db.usuarios.findUnique({
    where: {
      Id: Number(params.id),
    },
    include: {
      Role: true, // Incluir el rol relacionado
    },
  });

  return NextResponse.json(usuario);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const usuarioActualizado = await db.usuarios.update({
    where: {
      Id: Number(params.id),
    },
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      roleId: Number(data.roleId), // Actualizar el ID del rol
    },
  });
  return NextResponse.json(usuarioActualizado);
}

export async function DELETE(request, { params }) {
  const usuario = await db.usuarios.delete({
    where: {
      Id: Number(params.id),
    }
  });
  return NextResponse.json(usuario);
}
