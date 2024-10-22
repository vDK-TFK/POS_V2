import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
        tipoImagen: model.tipoImagen ? model.tipoImagen : null,
      },
    });

    // Verificar si se creó el usuario
    if (!nuevoProdVenta) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al registrar el producto",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Producto registrado satisfactoriamente",
    });
  } catch (error) {
    console.error("Error al registrar el producto:", error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al registrar el producto: " + error.message,
    });
  }
}

//Obtener
export async function GET() {
  try {
    const listaProdVenta = await prisma.productoVenta.findMany({
      where:{
        eliminado:false
      }
    });

    if (listaProdVenta.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron productos. Puede crear uno nuevo",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: listaProdVenta,
      message: "Se han obtenido los productos",
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        message: "Error al obtener los productos: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
    try {
      const model = await request.json();

      const prodVentaEliminar = await prisma.productoVenta.update({
        data: {
          eliminado: model.eliminado,
        },
        where: {
          idProductoVenta: model.idProductoVenta,
        },
      });

      // Verificar si se elimino el producto
      if (!prodVentaEliminar) {
        return NextResponse.json({
          code: 400,
          status: "error",
          message: "Error al eliminar el producto",
        });
      }

      return NextResponse.json({
        code: 200,
        status: "success",
        data: prodVentaEliminar,
        message: "Producto eliminado satisfactoriamente",
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return NextResponse.json({
        code: 500,
        status: "error",
        message: "Error al eliminar el producto: " + error.message,
      });
    }
}

//Editar Producto de Venta
export async function PUT(request) {
  try {
    const model = await request.json();

    const updateProdVenta = await prisma.productoVenta.update({
      data: {
        nombre: model.nombre,
        cantidad: model.cantidad,
        cantidadMinima: model.cantidadMinima,
        precio: model.precio,
        idUsuarioModificacion: model.idUsuarioModificacion,
        fechaModificacion: new Date(),
        idCategoriaProdVenta: model.idCategoriaProdVenta,
        noRebajaInventario: model.noRebajaInventario,
        imagen: model.imagen,
        tipoImagen: model.tipoImagen,
      },
      where: {
        idProductoVenta: model.idProductoVenta,
      },
    });

    // Verificar si se actualizó el prod.
    if (!updateProdVenta) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al actualizar el producto",
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Producto actualizado satisfactoriamente",
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al actualizar el producto: " + error.message,
    });
  }
}
