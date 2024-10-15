import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request, { params }) {
    console.log(params.id);

    const role = await db.role.findUnique({
        where: {
            IdRole: Number(params.id),
        },
    });
    console.log(role);
    return NextResponse.json(role);
}

export async function PUT(request, { params }) {
    const data = await request.json();
    const roleActualizado = await db.role.update({
        where: {
            IdRole: Number(params.id),
        },
        data: data,
    });
    return NextResponse.json(roleActualizado);
}

export async function DELETE(request, { params }) {
    const role = await db.role.delete({
        where: {
            IdRole: Number(params.id),
        },
    });
    console.log(role);
    return NextResponse.json(role);
}
