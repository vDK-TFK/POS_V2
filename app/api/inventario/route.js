import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productos = await prisma.productos.findMany({
      where: {
        Eliminado: false, // Solo productos no eliminados
      },
      include: {
        Categoria: { select: { NombreCategoria: true } },
        Proveedor: { select: { Nombre: true } },
      },
    });

    if (!productos || productos.length === 0) {
      return NextResponse.json({
        code: 204,
        status: 'error',
        message: 'No se encontraron productos',
      });
    }

    const productosConNombres = productos.map((producto) => ({
      ProductoID: producto.ProductoID,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      PrecioCompra: producto.PrecioCompra,
      PrecioVenta: producto.PrecioVenta,
      Stock: producto.Stock,
      FechaIngreso: producto.FechaIngreso,
      FechaCaducidad: producto.FechaCaducidad,
      Estado: producto.Estado,
      NombreCategoria: producto.Categoria?.NombreCategoria || 'N/A',
      NombreProveedor: producto.Proveedor?.Nombre || 'N/A',
    }));

    return NextResponse.json({
      code: 200,
      status: 'success',
      data: productosConNombres,
      message: 'Productos obtenidos satisfactoriamente',
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json(
      { code: 500, status: 'error', message: `Error al obtener los productos: ${error.message}` },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const data = await request.json();

    const nuevoProducto = await prisma.productos.create({
      data: {
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        PrecioCompra: data.PrecioCompra,
        PrecioVenta: data.PrecioVenta,
        Stock: data.Stock,
        CategoriaID: data.CategoriaID,
        ProveedorID: data.ProveedorID,
        FechaIngreso: new Date(data.FechaIngreso),
        FechaCaducidad: data.FechaCaducidad ? new Date(data.FechaCaducidad) : null,
        Estado: data.Estado,
        IdUsuarioCreacion: data.IdUsuarioCreacion, // Usuario que crea
        FechaCreacion: new Date(), // Fecha de creación automática
      },
    });

    return NextResponse.json({
      code: 200,
      status: 'success',
      data: nuevoProducto,
      message: 'Producto creado satisfactoriamente',
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json(
      { code: 500, status: 'error', message: `Error al crear el producto: ${error.message}` },
      { status: 500 }
    );
  }
}

