import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

//Listar clientes
export async function GET() {
  try {
    const listaClientes = await prisma.clientes.findMany({
      select: {
        idCliente: true,
        nombreCompleto: true,
        telefono: true,
        celular: true,
        fechaCreacion: true,
        eliminado: true
      }

    });

    if (listaClientes.length == 0) {
      return NextResponse.json({
        code: 204,
        status: "failed",
        message: "No se encontraron registros."
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: listaClientes,
      message: ""
    });



  }
  catch (error) {
    console.error('Error al obtener los datos:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al obtener los datos: " + error.message
    }, { status: 500 });
  }

}

//Nuevo Cliente
export async function POST(request) {
  try {
    const model = await request.json();

    const nuevoCliente = await prisma.clientes.create({
      data: {
        nombreCompleto: model.nombre,
        telefono: model.telefono,
        celular: model.celular == "" ? '00000000' : model.celular,
        direccion: model.direccion,
        idUsuarioCreacion: model.idUsuarioCreacion,
        eliminado:false
      }
    });

    // Verificar si se creó el usuario
    if (!nuevoCliente) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al registrar el cliente"
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Cliente registrado satisfactoriamente"
    });
  }


  catch (error) {
    console.error('Error al registrar el cliente:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al registrar el cliente: " + error.message
    });
  }





}

//Editar Cliente
export async function PUT(request) {
  try {
    const model = await request.json();

    const actualizarCliente = await prisma.clientes.update({
      data: {
        nombreCompleto: model.nombre,
        telefono: model.telefono,
        celular: model.celular == "" ? '00000000' : model.celular,
        direccion: model.direccion,
        idUsuarioModificacion: model.idUsuarioModificacion,
        fechaModificacion: new Date(),
        eliminado:false
      },
      where:{
        idCliente:model.idCliente,
      }
    });

    // Verificar si se creó el usuario
    if (!actualizarCliente) {
      return NextResponse.json({
        code: 400,
        status: "error",
        message: "Error al actualizar el cliente"
      });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      data: true,
      message: "Cliente actualizado satisfactoriamente"
    });
  }


  catch (error) {
    console.error('Error al actualizar el cliente:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Error al actualizar el cliente: " + error.message
    });
  }





}

//Bloquear o Activar cliente (Borrado lógico)
export async function DELETE(request) {
  try {
      const { id, esBloquear, idUsuarioModificacion } = await request.json();

      // Actualizar el estado
      const cambiaEstadoCliente = await prisma.clientes.update({
          where: { idCliente:id },
          data: {
              eliminado:esBloquear,
              idUsuarioModificacion: idUsuarioModificacion,
              fechaModificacion: new Date()
          }
      });

      if (!cambiaEstadoCliente) {
          return NextResponse.json({
              code: 400,
              status: "error",
              message: `Error al ${esBloquear ? 'inactivar/bloquear' : 'activar/desbloquear'} el registro`
          });
      }

      return NextResponse.json({
          code: 200,
          status: "success",
          data: true,
          message: esBloquear ? "Se ha inactivado/bloqueado el registro correctamente" : "Se ha activado/desbloqueado el registro correctamente"
      });

  } catch (error) {
      console.error(`Error al ${esBloquear ? 'inactivar/bloquear' : 'activar/desbloquear'} el registro`, error);
      return NextResponse.json({
          code: 500,
          status: "error",
          message: `Error al ${esBloquear ? 'inactivar/bloquear' : 'activar/desbloquear'} el registro` + error.message
      });
  }
}