const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const idRol = Number(params.id);

        const rol = await prisma.roles.findFirst({
            select: {
                idRol: true,
                nombre: true,
                descripcion: true,
                Permisos: { 
                    select: {
                        permiso: {
                            select: {
                                idPermiso: true,
                                idPermisoPadre:true,
                                nombre: true,
                                url: true,
                                icono: true,
                                jerarquia: true
                            }
                        }
                    }
                }
            },
            where: {
                oculto: false,
                eliminado: false,
                idRol: idRol
            }
        });

        if (!rol) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            }, { status: 204 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: rol,
            message: ""
        }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener los permisos y el rol:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error en la obtención de datos: " + error.message
        }, { status: 500 });
    }
}
