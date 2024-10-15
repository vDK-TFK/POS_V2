const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

//Crear un nuevo horario para el usuario
export async function POST(request) {
    try {
        const data = await request.json();
        const { usuarioId, horarios } = data;

        if (!usuarioId || !Array.isArray(horarios)) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Los parámetros no cumplen con el formato correcto"
            }, { status: 400 });
        }

        const nuevoHorarioUsuario = await Promise.all(
            horarios.map(horario =>
                prisma.horario.create({
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

        if (!nuevoHorarioUsuario) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al crear el horario."
            }, { status: 400 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: "Horario creado satisfactoriamente."
        }, { status: 200 });

    } 
    catch (error) {
        console.error('Error al crear el horario:', error);
        return NextResponse.json({
          code: 500,
          status: "error",
          message: "Error al crear el horario: " + error.message
        }, { status: 500 });
      }
}

//Actualizar el horario del usuario
export async function PUT(request) {
    try {
        const data = await request.json();
        const { usuarioId, horarios } = data;

        if (!usuarioId || !Array.isArray(horarios)) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Los parámetros no cumplen con el formato correcto"
            }, { status: 400 });
        }

        const updateHorario = horarios.map(horario => {
            return prisma.horario.update({
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
      
          await Promise.all(updateHorario);

        if (!updateHorario) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al editar el horario."
            }, { status: 400 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: "Horario editado satisfactoriamente."
        }, { status: 200 });

    } 
    catch (error) {
        console.error('Error al editar el horario:', error);
        return NextResponse.json({
          code: 500,
          status: "error",
          message: "Error al editar el horario: " + error.message
        }, { status: 500 });
      }
}