import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {

    try {
        const idUsuarioEmpleado = Number(params.id);

        const asistencias = await prisma.asistencia.findMany({
            where: {
                idUsuarioEmpleado:idUsuarioEmpleado
            },
        });
        
        if (!asistencias) {
            return NextResponse.json({ message: 'No se han registrado asistencias.' }, { status: 404 });
        }        
        console.log("Asistencias Calendario: " + JSON.stringify(asistencias))

        
        return NextResponse.json(asistencias);


    } catch (error) {
        console.error('Error fetching asistencias:', error); 
        return NextResponse.json({
            error: 'Error al verificar las asistencias.',
        }, { status: 500 });
    }
}
