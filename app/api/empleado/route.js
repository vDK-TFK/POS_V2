import { NextResponse } from 'next/server';
import db from '@/app/lib/db'
export async function GET() {
  try {
      const empleados = await db.usuarios.findMany({
          include: {
              horarios: true, // Incluir horarios en la respuesta
          },
      });
      return NextResponse.json(empleados);
  } catch (error) {
      return NextResponse.json({ error: 'Error al obtener los empleados' }, { status: 500 });
  }
}
