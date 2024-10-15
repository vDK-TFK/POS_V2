import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
    try {
        const empleadoId = Number(params.id);

        const metas = await db.metas.findMany({
            where: {
                empleadoId: empleadoId,
            },
            include: {
                empleado: true,
              },
        });

        if (metas.length === 0) { 
            return NextResponse.json({ message: 'No se han registrado metas.' }, { status: 404 });
        }

        return NextResponse.json(metas);
    } catch (error) {
        console.error('Error fetching metas:', error);
        return NextResponse.json({
            error: 'Error al verificar las metas.',
        }, { status: 500 });
    }
}
export async function DELETE(request, { params }) {
    const meta = await db.metas.delete({
      where: {
        id: Number(params.id),
      }
    });
    return NextResponse.json(meta);
  }
  