import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { idInfoCaja } = params;

        if (!idInfoCaja) {
            return NextResponse.json({
                code: 400,
                status: "failed",
                data: [],
                message: "Falta el parámetro idInfoCaja"
            });
        }

        const infoCaja = await db.infoCaja.findUnique({
            where: {
                idInfoCaja: Number(idInfoCaja)
            },
            select: {
                idInfoCaja: true,
                fechaApertura: true,
                fechaCierre: true,
                montoInicioCaja: true,
                montoCierreCaja: true,
                facturas: {
                    select: {
                        total: true,
                        vuelto: true,
                        pagadoCon: true
                    },
                    where: {
                        estadoFac: {
                            notIn: ['NULA']
                        }
                    }
                },
                movimientos: {
                    select: {
                        idMovimiento: true,
                        monto: true,
                        idTipoMovimiento: true,
                    },
                    where: {
                        idEstadoMovimiento: 1,
                    }
                },
            }
        });

        if (!infoCaja) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                data: [],
                message: "No se encontró la información de la caja"
            });
        }

        const totalFacturado = infoCaja.facturas
            .reduce((acc, factura) => acc + (Number(factura.pagadoCon) - Number(factura.vuelto)), 0)
            .toFixed(2);

        const totalEntradas = infoCaja.movimientos
            .filter(mov => mov.idTipoMovimiento === 1)
            .reduce((acc, mov) => acc + Number(mov.monto), 0);

        const totalSalidas = infoCaja.movimientos
            .filter(mov => mov.idTipoMovimiento === 2)
            .reduce((acc, mov) => acc + Number(mov.monto), 0);

        let montoInicio = Number(infoCaja.montoInicioCaja);
        let montoCierre = infoCaja.montoCierreCaja !== null ? Number(infoCaja.montoCierreCaja) : 0;
        let entradas = Number(totalEntradas);
        let salidas = Number(totalSalidas);

        const result = {
            idInfoCaja: infoCaja.idInfoCaja,
            totalFacturado: Number(totalFacturado),
            montoCierreCaja: Number(montoCierre),
            montoInicioCaja: montoInicio,
            totalEntradas: entradas,
            totalSalidas: salidas,
            diferencia: ((montoInicio + entradas + Number(totalFacturado)) - salidas) - montoCierre
        };

        return NextResponse.json({
            code: 200,
            status: "success",
            data: result,
            message: "Se ha obtenido la información de la caja"
        });

    } catch (error) {
        console.error('Error al obtener la información de la caja:', error);
        return NextResponse.json({
            code: 500,
            status: "failed",
            data: [],
            message: "Error en la obtención de datos: " + error
        });
    }
}
