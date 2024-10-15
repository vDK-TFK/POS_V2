const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const listaInfoCaja = await prisma.infoCaja.findMany({
            select: {
                idInfoCaja: true,
                fechaApertura: true,
                fechaCierre: true,
                montoInicioCaja: true,
                montoCierreCaja: true,
            },
            orderBy: { idInfoCaja: 'desc' }
        });

        if (!listaInfoCaja.length) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            }, { status: 204 });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaInfoCaja,
            message: ""
        }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener la lista de cajas:', error);
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
        const fechaApertura = new Date().toISOString();
        const fechaConsulta = new Date();
        fechaConsulta.setDate(fechaConsulta.getDate() + 1);

        const aperturaCaja = await prisma.infoCaja.create({
            data: {
                fechaApertura,
                fechaCierre: null,
                idUsuario: 1,
                fechaConsultaCaja: fechaConsulta.toISOString(),
                montoInicioCaja: Number(data.montoInicioCaja)
            },
        });

        return NextResponse.json({
            code: 200,
            status: "success",
            data: aperturaCaja,
            message: "Caja abierta correctamente."
        }, { status: 200 });

    } catch (error) {
        console.error('Error al abrir la caja:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al abrir la caja: " + error.message
        }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const model = {
            montoCierreCaja: data.montoCierreCaja,
            fechaCierre: new Date().toISOString()
        };

        const updCaja = await prisma.infoCaja.update({
            where: { idInfoCaja: data.idInfoCaja },
            data: model
        });

        return NextResponse.json({
            code: 200,
            status: "success",
            data: updCaja,
            message: "Caja actualizada correctamente."
        }, { status: 200 });

    } catch (error) {
        console.error('Error al actualizar la caja:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al actualizar la caja: " + error.message
        }, { status: 500 });
    }
}