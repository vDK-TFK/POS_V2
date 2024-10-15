import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET() {
  try {
    const productos = await db.productos.findMany();
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 });
  }
}

export async function POST(request) {
  const data = await request.json();
  try {
    const nuevoProducto = await db.productos.create({
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
      },
    });
    return NextResponse.json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}
