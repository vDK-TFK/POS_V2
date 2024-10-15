const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const rol = await prisma.roles.findUnique({
      where: { idRol: Number(id) },
      select: {
        idRol: true,
        nombre: true,
        descripcion: true,
        Permisos: {
          select: { idPermiso: true },
        },
      },
    });

    console.log(rol)

    if (!rol) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron registros.",
      }, { status: 204 });
    }

    const listaPermisos = rol.Permisos.map(p => p.idPermiso);

    return NextResponse.json({
      code: 200,
      status: "success",
      data: {
        rol: {
          idRol: rol.idRol,
          nombre: rol.nombre,
          descripcion: rol.descripcion,
        },
        listaPermisos,
      },
      message: "Se ha obtenido el rol satisfactoriamente",
    }, { status: 200 });

  } 
  catch (error) {
    console.error('Error al obtener el rol:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al obtener el rol: " + error.message,
    }, { status: 500 });
  }
}