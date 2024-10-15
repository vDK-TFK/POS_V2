const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

//Guardar evaluación nueva
export async function POST(request) {
  try {
      const model = await request.json();

      //Crear la evaluación
      const nuevaEvaluacion = await prisma.metas.create({
          data: {
              idEmpleado: model.idEmpleado,
              asunto: model.asunto,
              observaciones:model.observaciones,
              idUsuarioCreacion:model.idUsuarioCreacion,
              fechaCreacion: new Date(),
              vistoEmpleado:false
          }
      });

      // Verificar si se creó la evaluación
      if (!nuevaEvaluacion) {
          return NextResponse.json({
              code: 400,
              status: "error",
              message: "Error al registrar la evaluación"
          });
      }

      return NextResponse.json({
          code: 200,
          status: "success",
          data: true,
          message: "Evaluación registrada correctamente"
      });

  }
  catch (error) {
      console.error('Error al registrar la evaluación:', error);
      return NextResponse.json({
          code: 500,
          status: "error",
          message: "Error al registrar la evaluación: " + error.message
      });
  }
}