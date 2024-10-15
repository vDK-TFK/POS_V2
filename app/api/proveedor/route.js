import { NextResponse } from 'next/server';
import db from '@/app/lib/db'
export async function GET() {

  const proveedores = await db.proveedores.findMany()
  return NextResponse.json(proveedores);
}

export async function POST(request) {
  const data = await request.json();
  try {
    const nuevoProveedor = await db.proveedores.create({
      data: {
        Nombre: data.Nombre,
        Tipo: data.Tipo,
        Telefono: data.Telefono,
        Email: data.Email,
        SitioWeb: data.SitioWeb,
        Direccion: data.Direccion,
        Contacto: data.Contacto,
      },
    });
    return NextResponse.json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    return NextResponse.json({ error: 'Error al crear el proveedor' }, { status: 500 });
  }
}