import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const data = await request.json();
        console.log(JSON.stringify(data))

        const newMovimiento = await prisma.movimientos.create({
            data: {
                idTipoMovimiento: data.idTipoMovimiento,
                idEstadoMovimiento: 1,
                motivo: data.motivo,
                idInfoCaja: data.idInfoCaja,
                monto: data.monto,
                idUsuarioCreacion:data.idUsuarioCreacion
            },
        });

        if (!newMovimiento) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "Error al guardar el movimiento"
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: newMovimiento,
            message: "Movimiento creado correctamente."
        });

    } catch (error) {
        console.error('Error al crear el movimiento de caja:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al crear el movimiento de caja: " + error.message
        });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();;

        const updMovimiento = await prisma.movimientos.update({
            where: { idMovimiento: data.idMovimiento },
            data: {
                idEstadoMovimiento:3
            }
        });

        if (!updMovimiento) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "Error al anular el movimiento"
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: updMovimiento,
            message: "Movimiento anulado correctamente."
        });

    } catch (error) {
        console.error('Error al anular el movimiento:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al anular el movimiento: " + error.message
        });
    }
}