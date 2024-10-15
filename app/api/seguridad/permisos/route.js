const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const listaPermisos = await prisma.permisos.findMany({
            select: {
                idPermiso:true,
                idPermisoPadre:true,
                jerarquia:true,
                nombre:true
            },
            where:{
                oculto:false,
                eliminado:false
            }
        });

        if (!listaRoles.length) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            }, { status: 204 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaPermisos,
            message: ""
        }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error en la obtención de datos: " + error.message
        }, { status: 500 });
    }
}




