import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
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
            orderBy: { idMovimiento: 'desc' }
        });

        if (!listaMovimientos.length) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            }, { status: 204 });
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

export async function POST(request) {
    try {
        const data = await request.json();

        const newMovimiento = await prisma.movimientos.create({
            data: {
                idTipoMovimiento: data.idTipoMovimiento,
                idEstadoMovimiento: 1,
                fechaCreacion: new Date().toISOString(),
                idUsuarioCreacion: 1,
                motivo: data.motivo,
                idInfoCaja: data.idInfoCaja,
                monto: data.monto
            },
        });

        return NextResponse.json({
            code: 200,
            status: "success",
            data: newMovimiento,
            message: "Movimiento creado correctamente."
        }, { status: 200 });

    } catch (error) {
        console.error('Error al crear el movimiento de caja:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al crear el movimiento de caja: " + error.message
        }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const model = { idEstadoMovimiento: data.esAnular ? 3 : 2 };

        const updMovimiento = await prisma.movimientos.update({
            where: { idMovimiento: data.idMovimiento },
            data: model
        });

        return NextResponse.json({
            code: 200,
            status: "success",
            data: updMovimiento,
            message: "Movimiento actualizado correctamente."
        }, { status: 200 });

    } catch (error) {
        console.error('Error al actualizar el movimiento:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al actualizar el movimiento: " + error.message
        }, { status: 500 });
    }
}