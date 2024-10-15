import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
   try{
      const infoCajaActual = await prisma.InfoCaja.findFirst({
         where: {
             fechaCierre: null,
         },
         orderBy: {
             idInfoCaja: 'desc',
         }
     });
     

      if (!infoCajaActual) {
         return NextResponse.json(
            {
               code:204,
               status:"failed",
               data:[],
               message:"No existen cajas abiertas, puede aperturar una caja si lo requiere."
            }
         );
      }
   
      return NextResponse.json(
         {
            code:200,
            status:"success",
            data:infoCajaActual,
            message:""
         }
      );
   }
   catch(error){
      return NextResponse.json(
         {
            code:404,
            status:"failed",
            data:[],
            message:"Error en servidor: " + error
         }
      );
   }

   
}

