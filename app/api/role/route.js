
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET() {
    const role = await db.role.findMany();
    return NextResponse.json(role);
}

export async function POST(request) {
    const data = await request.json();

    const nuevoRol = await db.role.create({
        data: {
            Descripcion: data.Descripcion,
        },
    });

    return NextResponse.json(nuevoRol);
}