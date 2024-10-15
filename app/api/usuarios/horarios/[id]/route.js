const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

//Obtener el horario de un usuario por Id
export async function GET(request,{params}) {
    try {
        
        let idUsuario = Number(params.id);

        const horariosByUsuario = await prisma.horario.findMany({
            where:{
                usuarioId:idUsuario
            }
        });


        if (horariosByUsuario.length == 0) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            }, { status: 204 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: horariosByUsuario,
            message: ""
        }, { status: 200 });

    } 
    catch (error) {
        console.error('Error al obtener los datos:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al obtener los datos: " + error.message
        }, { status: 500 });
    }
}