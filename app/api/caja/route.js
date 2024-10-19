const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    // Obtener los parámetros de la URL
    const { searchParams } = request.nextUrl;
    const idUsuarioCreacion = Number(searchParams.get('idUsuarioCreacion'));
    const esEmpleado = searchParams.get('esEmpleado') === 'true';  // Convertir a booleano

    const model = {
        idUsuarioCreacion,
        esEmpleado,
    };

    try {
        const listaInfoCaja = await prisma.infoCaja.findMany({
            select: {
                idInfoCaja: true,
                fechaApertura: true,
                fechaCierre: true,
                montoInicioCaja: true,
                montoCierreCaja: true,
            },
            orderBy: { idInfoCaja: 'desc' },
            where: model.esEmpleado ? { idUsuarioCreacion: model.idUsuarioCreacion } : undefined
        });

        if (!listaInfoCaja.length) {
          return NextResponse.json({
            code: 204,
            status: "failed",
            message: "No se encontraron registros.",
          });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaInfoCaja,
            message: "Se ha obtenido la información"
        }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener los registros:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al obtener los registros: " + error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const model = await request.json();
        const fechaConsulta = new Date();
        fechaConsulta.setDate(fechaConsulta.getDate() + 1);

        const nuevaCaja = await prisma.infoCaja.create({
            data: {
                fechaApertura:new Date(),
                fechaCierre: null,
                idUsuarioCreacion: model.idUsuarioCreacion,
                fechaConsultaCaja: fechaConsulta,
                montoInicioCaja: Number(model.montoInicioCaja)
            },
        });

        if(!nuevaCaja){
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al aperturar la caja"
              });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: nuevaCaja,
            message: "Se ha aperturado la caja correctamente"
          });

    } 
    catch (error) {
        console.error('Error al aperturar la caja:', error);
        return NextResponse.json({
          code: 500,
          status: "error",
          message: "Error al aperturar la caja: " + error.message
        });
      }
}

export async function PUT(request) {
    try {
        const data = await request.json();
    
        const cerrarCaja = await prisma.infoCaja.update({
            where: { idInfoCaja: data.idInfoCaja },
            data: {
                montoCierreCaja: data.montoCierreCaja,
                idUsuarioModificacion:data.idUsuarioModificacion,
                fechaModificacion:new Date(),
                fechaCierre: new Date()

            }
        });

        if(!cerrarCaja){
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al cerrar la caja actual"
              });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: cerrarCaja,
            message: "Caja ha sido cerrada correctamente"
        });

    } 
    catch (error) {
        console.error('Error al cerrar la caja:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al cerrar la caja: " + error.message
        });
    }
}