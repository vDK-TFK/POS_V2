import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const horarios = await db.horario.findMany();
    return NextResponse.json(horarios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los horarios' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { usuarioId, horarios } = data;

    if (!usuarioId || !Array.isArray(horarios)) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const newHorarios = await Promise.all(
      horarios.map(horario =>
        db.horario.create({
          data: {
            usuarioId,
            dia: horario.Dia, 
            inicio: horario.HoraInicio,
            fin: horario.HoraFin,
            esDiaLibre: horario.esDiaLibre
          }
        })
      )
    );

    return NextResponse.json(newHorarios, { status: 201 });
  } catch (error) {
    console.error('Error al crear los horarios:', error);
    return NextResponse.json({ error: 'Error al crear los horarios' }, { status: 500 });
  }
}
