import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

//Buscar cliente en específico
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const cliente = await prisma.clientes.findUnique({
      select: {
        idCliente: true,
        nombreCompleto: true,
        direccion:true,
        telefono: true,
        celular: true,
        fechaCreacion: true,
        eliminado: true
      },
      where:{
        idCliente:Number(id)
      }

    });

    if (!cliente) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron registros.",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data:cliente,
      message: "Se ha obtenido el cliente satisfactoriamente",
    });



  }
  catch (error) {
    console.error('Error al obtener el cliente:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al obtener el cliente: " + error.message,
    });
  }

}









