import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

async function getAuditoriaLogins() {
  return await db.auditoriaLogin.findMany({
    select: {
      IdAuditoriaLogin: true,
      Usuario: true,
      FechaLogin: true,
      FechaEstadoActualizado: true,
      IdStatusAuditoriaLogin: true,
      Mensaje: true,
      Clave: false
    }
  });
}

async function getStatusAuditoriaLogins() {
  return await db.statusAuditoriaLogin.findMany({
    select: {
      IdStatusAuditoriaLogin: true,
      Status: true
    }
  });
}

function mergeResults(auditoriaLogins, statusAuditoriaLogins) {
  return auditoriaLogins.map(auditoria => {
    const status = statusAuditoriaLogins.find(
      status => status.IdStatusAuditoriaLogin === auditoria.IdStatusAuditoriaLogin
    );
    return {
      ...auditoria,
      Status: status ? status.Status : null
    };
  });
}

export async function GET() {
  const auditoriaLogins = await getAuditoriaLogins();
  const statusAuditoriaLogins = await getStatusAuditoriaLogins();
  const mergedData = mergeResults(auditoriaLogins, statusAuditoriaLogins);

  return NextResponse.json(mergedData);
}
