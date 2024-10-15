import { NextResponse } from 'next/server';
import db from '@/app/lib/db'; // Asegúrate de que la importación es correcta

export async function GET(request, { params }) {
  console.log('Received params:', params); // debugging

  try {
      const empleadoId = Number(params.id);
      console.log('Parsed empleadoId:', empleadoId); 

      const horarios = await db.horario.findMany({
          where: {
            usuarioId: empleadoId,
          },
      });
      
      if (!horarios) {
          return NextResponse.json({ message: 'No se han registrado asistencias.' }, { status: 404 });
      }
      
      return NextResponse.json(horarios);


  } catch (error) {
      console.error('Error fetching horarios:', error); 
      return NextResponse.json({
          error: 'Error al verificar los horarios.',
      }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const usuarioId = Number(params.id);
    const horarios = data.horarios;
    const updatePromises = horarios.map(horario => {
      return db.horario.update({
        where: {
          usuarioId_dia: {
            usuarioId: usuarioId,
            dia: horario.dia
          }
        },
        data: {
          inicio: horario.inicio,
          fin: horario.fin,
          esDiaLibre: horario.esDiaLibre
        }
      });
    });

    // Ejecuta todas las actualizaciones
    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Horarios actualizados exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    return NextResponse.json({ error: 'Error al actualizar el horario' }, { status: 500 });
  }
}

// DELETE Handler para eliminar un horario
export async function DELETE(request, { params }) {
  try {
    const horario = await db.horario.delete({
      where: {
        usuarioId: Number(params.id), // Asegúrate de que el campo es correcto
      },
    });
    return NextResponse.json(horario);
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el horario' }, { status: 500 });
  }
}
