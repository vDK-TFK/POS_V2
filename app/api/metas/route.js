import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const metas = await db.metas.findMany({
      include: {
        empleado: true,
      },
    });
    return NextResponse.json(metas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los metas' }, { status: 500 });
  }
}


export async function POST(request) {
    const data = await request.json();
    const { empleadoId,asunto, observaciones, fecha } = data;  
    try {
      const newMeta = await db.metas.create({
        data: {
            empleadoId,
            asunto,
            observaciones,
            fecha,
        },
      });
      return NextResponse.json(newMeta, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Error al crear el meta' }, { status: 500 });
    }
  }