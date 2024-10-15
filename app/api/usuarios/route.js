const { PrismaClient } = require('@prisma/client');
import { NextResponse } from 'next/server';
import { sendEmail } from '../emails/sendEmail';
import { VerifyEmailTemplate } from '@/app/template/verify-email';
const bcrypt = require("bcrypt");
import crypto from 'crypto';

const prisma = new PrismaClient();

//Listado de usuarios
export async function GET() {
    try {
        const listaUsuarios = await prisma.usuarios.findMany({
            where: {
                oculto: false,
            },
            select: {
                idUsuario: true,
                usuario:true,
                nombre: true,
                apellidos: true,
                correo: true,
                telefono: true,
                esEmpleado: true,
                bloqueado:true,
                horarios: true,
                Rol:{
                    select:{
                        idRol:true,
                        nombre:true
                    }
                }
            }
        });
        


        if (listaUsuarios.length == 0) {
            return NextResponse.json({
                code: 204,
                status: "failed",
                message: "No se encontraron registros."
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: listaUsuarios,
            message: ""
        }, { status: 200 });

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

//Guardar usuario nuevo
export async function POST(request) {
    try {
        const model = await request.json();

        const existe = await prisma.usuarios.findFirst({
            where: {
              OR: [
                { correo:model.correo },
                { usuario:model.usuario },
              ],
            },
          });

        if(existe){
            return NextResponse.json({
                code: 500,
                status: "error",
                message: "El usuario y/o correo ya existen registrados en el sistema."
            });
        }


        // Crear el nuevo usuario
        const nuevoUsuario = await prisma.usuarios.create({
            data: {
                nombre: model.nombre,
                apellidos: model.apellidos,
                correo: model.correo,
                telefono: model.telefono,
                idRol: model.idRol,
                usuario: model.usuario,
                clave: await bcrypt.hash(model.clave, 10),
                esEmpleado: model.esEmpleado,
                direccion: model.direccion,
                idUsuarioCreacion: model.idUsuarioCreacion,
                oculto:false,
                bloqueado:false,
                emailVerificationToken: crypto.randomBytes(32).toString("base64url")
            }
        });

        // Verificar si se creó el usuario
        if (!nuevoUsuario) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al registrar el usuario"
            });
        }

        // await sendEmail({
        //     from: "Soda Santa Ana <onboarding@resend.dev>",
        //     to: [nuevoUsuario.correo],
        //     subject: "Verificar su email",
        //     react: VerifyEmailTemplate({ email: nuevoUsuario.correo, emailVerificationToken: nuevoUsuario.emailVerificationToken })
        // });

        

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: "Usuario creado y rol asignado correctamente"
        });

    }
    catch (error) {
        console.error('Error al crear el usuario:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al crear el usuario: " + error.message
        });
    }
}

//Actualizar Usuario
export async function PUT(request) {
    try {
        const model = await request.json();

        // Crear el nuevo usuario
        const actualizaUsuario = await prisma.usuarios.update({
            where: {
                idUsuario: model.idUsuario
            },
            data: {
                nombre: model.nombre,
                apellidos: model.apellidos,
                correo: model.correo,
                telefono: model.telefono,
                idRol: model.idRol,
                usuario: model.usuario,
                esEmpleado: model.esEmpleado,
                direccion: model.direccion,
                idUsuarioModificacion: model.idUsuarioModificacion,
                fechaModificacion: new Date(),
                oculto:false,
                bloqueado:false
            }
        });

        // Verificar si se creó el usuario
        if (!actualizaUsuario) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al actualizar el usuario"
            });
        }

        // await sendEmail({
        //     from: "Soda Santa Ana <onboarding@resend.dev>",
        //     to: [actualizaUsuario.correo],
        //     subject: "Verificar su email",
        //     react: VerifyEmailTemplate({ email: actualizaUsuario.correo, emailVerificationToken: actualizaUsuario.emailVerificationToken })
        // });

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: "Usuario actualizado correctamente"
        });

    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al actualizar el usuario: " + error.message
        });
    }
}

//Bloquear o Activar usuario (Borrado lógico)
export async function DELETE(request) {
    try {
        const { id, esBloquear, idUsuarioModificacion } = await request.json();

        // Actualizar el estado de "bloqueado"
        const actualizaUsuario = await prisma.usuarios.update({
            where: { idUsuario:id },
            data: {
                bloqueado: esBloquear,
                idUsuarioModificacion,
                fechaModificacion: new Date(),
                intentos: esBloquear ? 0 : 3
            }
        });

        if (!actualizaUsuario) {
            return NextResponse.json({
                code: 400,
                status: "error",
                message: "Error al actualizar el estado del usuario"
            });
        }

        return NextResponse.json({
            code: 200,
            status: "success",
            data: true,
            message: esBloquear ? "Usuario bloqueado correctamente" : "Usuario desbloqueado correctamente"
        });

    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        return NextResponse.json({
            code: 500,
            status: "error",
            message: "Error al actualizar el estado del usuario: " + error.message
        });
    }
}
