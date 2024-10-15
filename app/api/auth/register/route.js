import { sendEmail } from '@/app/api/emails/sendEmail';
import db from '@/app/lib/db';
import { VerifyEmailTemplate } from '@/app/template/verify-email';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        console.log(data);

        // Verificar si el email ya existe
        const emailFound = await db.usuarios.findUnique({
            where: {
                email: data.email
            }
        });

        if (emailFound) {
            return NextResponse.json({
                message: "El email ya existe"
            }, {
                status: 400
            });
        }

        // Verificar si el nombre de usuario ya existe
        const usernameFound = await db.usuarios.findUnique({
            where: {
                username: data.username
            }
        });

        if (usernameFound) {
            return NextResponse.json({
                message: "El nombre de usuario ya existe"
            }, {
                status: 400
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Asignar el rol (por defecto 'empleado' si no se proporciona uno)
        const roleId = data.roleId || 3; // Ejemplo: asumimos que 1 es el Id del rol 'empleado'

        // Crear el nuevo usuario con el roleId asignado
        const newUser = await db.usuarios.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                nombre: data.nombre,
                apellido: data.apellido,
                direccion: data.direccion,
                telefono: data.telefono,
                Role: {
                    connect: {
                        IdRole: 1
                    }
                },
                Rol: {
                    connect: {
                        idRol: 1
                    }
                },
                roleId:1,
                IdRole:1
            },
        });

        // Generar token de verificación de email
        const emailVerificationToken = crypto.randomBytes(32).toString("base64url");

        // Actualizar el usuario con el token de verificación
        await db.usuarios.update({
            where: {
                Id: newUser.Id
            },
            data: {
                emailVerificationToken: emailVerificationToken,
            }
        });

        // Enviar correo electrónico de verificación
        await sendEmail({
            from: "Pollo Petote <onboarding@resend.dev>",
            to: [newUser.email],
            subject: "Verifique su email",
            react: VerifyEmailTemplate({ email: newUser.email, emailVerificationToken })
        });

        // Devolver respuesta con los datos del usuario creado (sin la contraseña)
        const { password: _, ...usuarioSinPassword } = newUser;
        return NextResponse.json(usuarioSinPassword);

    } catch (error) {
        console.error("Error en la solicitud:", error);
        return NextResponse.json({ error: "Ocurrió un error al crear usuario" }, { status: 500 });
    }
}
