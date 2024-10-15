import { NextResponse } from 'next/server';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const idUsuario = Number(params.id);

        const listaMetas = await prisma.metas.findMany({
            where: {
                idEmpleado: idUsuario,
                vistoEmpleado:false
            },
            include: {
                Empleado:{
                    select:{
                        idUsuario:true,
                        nombre:true,
                        apellidos:true,

                    }
                },
            },
        });

        if (listaMetas.length == 0) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaMetas,
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

export async function PUT(request, { params }) {
    try {
        const idMeta = Number(params.id);

        const marcarMeta = await prisma.metas.update({
            where:{
                idMeta:idMeta
            },
            data:{
                vistoEmpleado:true
            }
        })

        if (!marcarMeta) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al marcar la meta"
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: ""
        }, { status: 200 });
        
    } 
    catch (error) {
        console.error('Error al marcar el registro:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al marcar el registro: " + error.message
        }, { status: 500 });
    }
}
  