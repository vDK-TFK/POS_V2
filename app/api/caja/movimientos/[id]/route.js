import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

//Lista de movimientos x caja
export async function GET(request, {params}) {
    try {

        const idInfoCaja = Number(params.id);
        console.log("Server: " + idInfoCaja);

        const listaMovimientos = await prisma.movimientos.findMany({
            select: {
                idMovimiento: true,
                fechaCreacion: true,
                motivo: true,
                monto: true,
                idEstadoMovimiento: true,
                TipoMovimiento: { select: { nombre: true } },
                EstadoMovimiento: { select: { nombre: true } }
            },
            where:{
                idInfoCaja:idInfoCaja
            }
        });

        if (listaMovimientos.length == 0) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron movimientos en esta caja"
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaMovimientos,
            message: ""
        }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener la lista de movimientos:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error en la obtención de datos: " + error.message
        }, { status: 500 });
    }
}

