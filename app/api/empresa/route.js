import db from '@/app/lib/db';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET() {
   try{
      const result = await db.infoEmpresa.findFirst();

      if(!result){
         return NextResponse.json(
            {
                code: 204,
                status: "failed",
                data: [],
                message: "No se encontró la información de la empresa"
            }
        );
      }
      else{
         return NextResponse.json(
            {
                code: 200,
                status: "success",
                data: result,
                message: "Se ha obtenido la info de la empresa"
            }
        );
      }

   }
   catch(error){
      return NextResponse.json(
         {
            code:404,
            status:"failed",
            data:[],
            message:"Error al obtener la info de la empresa: " + error
         }
      );
   }

}

export async function POST(request){
   try{
      const d = await request.json();
      const infoEmpresaPost = await db.infoEmpresa.create({
         data: {
           nombre: d.nombre,
           nombreComercial: d.nombreComercial,
           identificacion: d.identificacion,
           correo: d.correo,
           telefono: d.telefono,
           celular: d.celular,
           direccion: d.direccion,
           logo: d.logo ? d.logo : null,
           tipoImagen: d.tipoImagen ? d.tipoImagen : null,
         },
       });

      if(!infoEmpresaPost){
         return NextResponse.json(
            {
               code:404,
               status:"failed",
               data:[],
               message:"Error al guardar la información de la empresa"
            }
         );
      }
      else{
         return NextResponse.json(
            {
               code:200,
               status:"success",
               data:infoEmpresaPost,
               message:"Información de la empresa guardada correctamente"
            }
         );
      }

   }
   catch(error){

      return NextResponse.json(
          {
             code:404,
             status:"failed",
             data:[],
             message:"Error al guardar la info de la empresa: " + error
          }
       );
  }
}

export async function PUT(request){

   try{
      const d = await request.json();

      var modelUpd = {
         nombre: d.nombre,
         nombreComercial: d.nombreComercial,
         identificacion: d.identificacion,
         correo: d.correo,
         telefono: d.telefono,
         celular: d.celular,
         direccion: d.direccion,
      }
   
      if(d.actualizaImagen){
         modelUpd.logo = d.logo
         modelUpd.tipoImagen = d.tipoImagen
      }
   
      const infoEmpresaUpd = await db.infoEmpresa.update({
         data:modelUpd,
         where:{idEmpresa: d.idEmpresa},
      });

      if(!infoEmpresaUpd){
         return NextResponse.json(
            {
               code:404,
               status:"failed",
               data:[],
               message:"Error al actualizar la información de la empresa"
            }
         );
      }
      else{
         return NextResponse.json(
            {
               code:200,
               status:"success",
               data:infoEmpresaUpd,
               message:"Información de la empresa actualizada correctamente"
            }
         );
      }


   }
   catch(error){
      return NextResponse.json(
         {
            code:404,
            status:"failed",
            data:[],
            message:"Error al actualizar la info de la empresa: " + error
         }
      );
   }


}