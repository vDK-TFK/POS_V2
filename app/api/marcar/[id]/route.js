import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const idUsuarioEmpleado = Number(params.id); 

  const today = new Date();
  const mes = String(today.getMonth() + 1).padStart(2, '0'); 
  const dia = String(today.getDate()).padStart(2, '0'); 
  const ano = today.getFullYear();
  const fechaLocal = `${ano}-${mes}-${dia}T00:00:00.000Z`;

  // Generar la fecha del siguiente día para la comparación
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const mesTom = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
  const diaTom = String(tomorrow.getDate()).padStart(2, '0'); 
  const anoTom = tomorrow.getFullYear();
  const fechaLocalTom = `${anoTom}-${mesTom}-${diaTom}T00:00:00.000Z`;

  try {
    const asistenciaHoy = await prisma.asistencia.findFirst({
      where:{
        idUsuarioEmpleado:idUsuarioEmpleado,
        fechaCreacion: {
          gte: new Date(fechaLocal), // Fecha de hoy 00:00:00
          lt: new Date(fechaLocalTom), // Fecha de mañana 00:00:00
        },
        fechaHoraSalida:null
      }
    })
 
    console.log("Asistencias: " + JSON.stringify(asistenciaHoy))

        
    if(!asistenciaHoy){
      return NextResponse.json({
        code: 400,
        status: "failed",
        message: "No ha registrado la asistencia el día de hoy"
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: asistenciaHoy,
      message: "Asistencia del día de hoy obtenida satisfactoriamente"
    });


  }
  catch (error) {
    console.error('Error al validar su asistencia del día de hoy:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al validar su asistencia del día de hoy: " + error.message
    });
  }
}

export async function POST(request, { params }) {
  try {
    const idAsistencia = Number(params.id); 
    const model = await request.json();

    const observacionAsistencia = await prisma.asistencia.update({
      data: {
        observacion:model.observacion
      },
      where:{
        idAsistencia:idAsistencia
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
