import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, {params}) {
   const idUsuarioCreacion = Number(params.id);

   try{
      const cajaActual = await prisma.infoCaja.findFirst({
         where: {
             fechaCierre: null,
             idUsuarioCreacion:idUsuarioCreacion
         },
         orderBy: {
             idInfoCaja: 'desc',
         }
     });
     

      if (!cajaActual) {
         return NextResponse.json({
            code: 204,
            status: "failed",
            message: "No existe una caja abierta. Puede aperturar una si la desea",
          });
      }
   
      return NextResponse.json(
         {
            code:200,
            status:"success",
            data:cajaActual,
            message:""
         }
      );
   }
   catch(error){
      console.error('Error al obtener la caja actual:', error);
      return NextResponse.json({
         code: 500,
         status: "error",
         message: "Error al obtener la caja actual: " + error.message,
      });
   }

   
}

