import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
    try {
      const factura = await db.facturas.findUnique({
        where: {
            idFactura: Number(params.id), 
        }
      });
  
      if (!factura) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(producto);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
    }
  }

export async function PUT(request, { params }) {
  try {
    console.log('ID recibido:', params.id); 

    const data = await request.json();
    console.log('Datos recibidos:', data); 

    const facturaActualizado = await db.facturas.update({
      where: {
        idFactura: Number(params.id),
      },
      data: data,
    });

    return NextResponse.json(facturaActualizado);
  } catch (error) {
    console.error('Error al actualizar la factura:', error); 
    return NextResponse.json({ error: 'Error al actualizar el factura' }, { status: 500 });
  }
}
