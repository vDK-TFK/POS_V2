const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';
import { getDateCR } from '../utils/js-helpers';

const prisma = new PrismaClient();

//Obtener Rol
export async function GET() {
  try {
    console.log("Fecha CR:" + getDateCR())
    const listaRoles = await prisma.roles.findMany({
      select: {
        idRol: true,
        nombre: true,
        descripcion: true,
        fechaCreacion: true,
      },
      where: {
        oculto: false,
        eliminado: false
      }
    });

    const listaPermisos = await prisma.permisos.findMany({
      select: {
        idPermiso: true,
        idPermisoPadre: true,
        nombre: true,
        jerarquia: true
      },
      where: {
        ocultar: false,
        eliminado: false
      }
    });

    var modelRetorno = {
      listaRoles: listaRoles,
      listaPermisos: listaPermisos
    }


    if (listaRoles.length == 0 || listaPermisos.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "success",
        message: "No se han encontrado registros.",
        data: modelRetorno
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: modelRetorno,
      message: "Se han obtenido los registros"
    });

  } catch (error) {
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error en la obtención de datos: " + error.message
    });
  }
}

export async function POST(request) {
  try {
    const model = await request.json();

    // Crear el nuevo rol
    const nuevoRol = await prisma.roles.create({
      data: {
        nombre: model.nombre,
        descripcion: model.descripcion,
        eliminado: false,
        oculto: false,
        idUsuarioCreacion: model.idUsuarioCreacion
      }
    });

    // Verificar si se creó el rol
    if (!nuevoRol) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al crear el rol."
      });
    }

    // Crear permisos para el nuevo rol
    await Promise.all(model.permisos.map(idPermiso =>
      prisma.permisosPorRoles.create({
        data: {
          idRol: nuevoRol.idRol,
          idPermiso: idPermiso
        }
      })
    ));


    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Rol creado y permisos asignados correctamente."
    });

  } 
  catch (error) {
    console.error('Error al crear el rol:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al crear el rol: " + error.message
    });
  }
}

export async function PUT(request) {
  try {
    const model = await request.json();

    // 1. Eliminar los permisos existentes
    const oldPermisos = await prisma.permisosPorRoles.deleteMany({
      where: {
        idRol: model.idRol
      }
    });

    const eliminados = oldPermisos.count > 0;

    if (eliminados) {
      //Actualiza el rol en tabla rol
      const updRol = await prisma.roles.update({
        data: {
          nombre: model.nombre,
          descripcion: model.descripcion,
          eliminado: false,
          oculto: false,
          idUsuarioModificacion: model.idUsuarioModificacion,
          fechaModificacion: new Date()
        },
        where: {
          idRol: model.idRol
        }
      });

      if (!updRol) {
        return NextResponse.json({
          code: 400,
          status: "error",
          message: "Error al actualizar el rol."
        });
      }

      // Crear de nuevo los permisos
      await Promise.all(model.permisos.map(idPermiso =>
        prisma.permisosPorRoles.create({
          data: {
            idRol: model.idRol,
            idPermiso: idPermiso
          }
        })
      ));

      return NextResponse.json({
        code: 200,
        status: "success",
        data: true,
        message: "Rol actualizado y permisos asignados correctamente."
      });
    } 
    else {
      // No se eliminaron permisos
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "No se eliminaron los permisos existentes."
      });
    }

  } 
  catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: `Error al procesar la solicitud: ${error.message}`
    });
  }
}