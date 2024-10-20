import db from '@/app/lib/db';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { FindById } from '../utils/db-methods';

const prisma = new PrismaClient()

//Agregar Producto de Venta
export async function POST(request) {

  try {
    const model = await request.json();

    const nuevoProdVenta = await prisma.productoVenta.create({
      data: {
        nombre: model.nombre,
        cantidad: model.cantidad,
        cantidadMinima: model.cantidadMinima,
        precio: model.precio,
        idUsuarioCreacion: model.idUsuarioCreacion,
        eliminado: false,
        idCategoriaProdVenta: model.idCategoriaProdVenta,
        noRebajaInventario: model.noRebajaInventario,
        imagen: model.imagen ? model.imagen : null,
        tipoImagen: model.tipoImagen ? model.tipoImagen : null

      },
    });

    // Verificar si se creó el usuario
    if (!nuevoProdVenta) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al registrar el producto"
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Producto registrado satisfactoriamente"
    });

  }
  catch (error) {
    console.error('Error al registrar el producto:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al registrar el producto: " + error.message
    });
  }

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


