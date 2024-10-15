import db from '@/app/lib/db';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { FindById } from '../utils/db-methods';

const prisma = new PrismaClient()

export async function POST(request) {
  const data = await request.json();
  const nuevoProdVenta = await db.productoVenta.create({
    data: {
      nombre: data.nombre,
      cantidad: data.cantidad,
      cantidadMinima: data.cantidadMinima, 
      precio: data.precio,
      idUsuarioCreacion: 1,
      eliminado: false,
      idCategoriaProdVenta: data.idCategoriaProdVenta,
      imagen: data.imagen ? data.imagen : null,
      tipoImagen: data.tipoImagen ? data.tipoImagen : null
    },
  });
  return NextResponse.json(nuevoProdVenta);
}



export async function GET() {
   const productosVenta = await db.productoVenta.findMany({where:{eliminado:false}})
   return NextResponse.json(productosVenta);
 }

 export async function GETBYID({id}) {
  const cliente = await FindById("clientes",id)
  return NextResponse.json(cliente);
}

 export async function DELETE(request){
  const data = await request.json();
  console.log(data);
  let model = {
    eliminado: data.eliminado
  };

  const prodEliminado = await prisma.productoVenta.update({ where: { idProductoVenta:data.idProductoVenta }, data:model });
  return NextResponse.json(prodEliminado); 

}

export async function PUT(request){
  const data = await request.json();

  var modelUpd = {
    nombre: data.nombre,
    cantidad: data.cantidad,
    cantidadMinima: data.cantidadMinima, 
    precio: data.precio,
    idCategoriaProdVenta: data.idCategoriaProdVenta,
  };

  if(data.actualizaImagen){
    modelUpd.imagen = data.imagen ? data.imagen : null;
    modelUpd.tipoImagen = data.tipoImagen ? data.tipoImagen : null;
  };
  
  
  const updProducto = await db.productoVenta.update({
    where:{ idProductoVenta:data.idProductoVenta },
    data:modelUpd
  }
);
return NextResponse.json(updProducto);

}


