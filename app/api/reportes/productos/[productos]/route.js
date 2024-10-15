import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { productos } = params;

    // Validar el parámetro productos
    if (!['diario', 'semanal', 'mensual', 'anual'].includes(productos)) {
        return NextResponse.json({ error: 'Parámetro de período no válido' }, { status: 400 });
    }

    try {
        let ventasProductos;

        switch (productos) {
            case 'diario':
                ventasProductos = await prisma.$queryRaw`
                    SELECT
                        DATE_FORMAT(DATE_SUB(f.fechaEmision, INTERVAL 6 HOUR), '%Y-%m-%d') AS periodo,
                        ROUND(SUM(df.cantidad * df.precio), 2) AS total_ventas,
                        pv.nombre AS producto
                    FROM Facturas f
                    JOIN DetallesFactura df ON f.idFactura = df.idFactura
                    JOIN ProductoVenta pv ON df.idProductoVenta = pv.idProductoVenta
                    WHERE f.fechaEmision >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                      AND f.estadoFac IN ('ACTIVA', 'PAGADA')
                    GROUP BY periodo, producto
                    ORDER BY periodo;
                `;
                break;

            case 'semanal':
                ventasProductos = await prisma.$queryRaw`
                    SELECT
                        DATE_FORMAT(DATE_SUB(f.fechaEmision, INTERVAL 6 HOUR), '%x-%v') AS periodo,
                        ROUND(SUM(df.cantidad * df.precio), 2) AS total_ventas,
                        pv.nombre AS producto
                    FROM Facturas f
                    JOIN DetallesFactura df ON f.idFactura = df.idFactura
                    JOIN ProductoVenta pv ON df.idProductoVenta = pv.idProductoVenta
                    WHERE f.fechaEmision >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
                      AND f.estadoFac IN ('ACTIVA', 'PAGADA')
                    GROUP BY periodo, producto
                    ORDER BY periodo;
                `;
                break;

            case 'mensual':
                ventasProductos = await prisma.$queryRaw`
                    SELECT
                        DATE_FORMAT(DATE_SUB(f.fechaEmision, INTERVAL 6 HOUR), '%Y-%m') AS periodo,
                        ROUND(SUM(df.cantidad * df.precio), 2) AS total_ventas,
                        pv.nombre AS producto
                    FROM Facturas f
                    JOIN DetallesFactura df ON f.idFactura = df.idFactura
                    JOIN ProductoVenta pv ON df.idProductoVenta = pv.idProductoVenta
                    WHERE f.fechaEmision >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                      AND f.estadoFac IN ('ACTIVA', 'PAGADA')
                    GROUP BY periodo, producto
                    ORDER BY periodo;
                `;
                break;

            case 'anual':
                ventasProductos = await prisma.$queryRaw`
                    SELECT
                        DATE_FORMAT(DATE_SUB(f.fechaEmision, INTERVAL 6 HOUR), '%Y') AS periodo,
                        ROUND(SUM(df.cantidad * df.precio), 2) AS total_ventas,
                        pv.nombre AS producto
                    FROM Facturas f
                    JOIN DetallesFactura df ON f.idFactura = df.idFactura
                    JOIN ProductoVenta pv ON df.idProductoVenta = pv.idProductoVenta
                    WHERE f.fechaEmision >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
                      AND f.estadoFac IN ('ACTIVA', 'PAGADA')
                    GROUP BY periodo, producto
                    ORDER BY periodo;
                `;
                break;
        }

        // Convertir BigInt a String para evitar problemas de serialización
        const processedResult = ventasProductos.map(row => ({
            periodo: row.periodo.toString(),
            total_ventas: Number(row.total_ventas),
            producto: row.producto
        }));

        return NextResponse.json({ ventasProductos: processedResult });
    } catch (error) {
        console.error('Error al obtener ventas de productos:', error);
        return NextResponse.json({ error: 'Error al obtener datos de ventas de productos' }, { status: 500 });
    }
}
