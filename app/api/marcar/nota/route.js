import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const model = await request.json();

    const observacionAsistencia = await prisma.asistencia.update({
      data: {
        observacion:model.observacion
      },
      where:{
        idAsistencia:model.idAsistencia
      }
    });

    // Verificar si se agregó la observacion
    if (!observacionAsistencia) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al agregar la observación"
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Observación incluida a la asistencia de hoy"
    });
  }


  catch (error) {
    console.error('Error al agregar la observación:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al agregar la observación: " + error.message
    });
  }
}
