"use server"

import db from "@/app/lib/db"
import bcrypt from "bcrypt"

export const changePassword = async (resetPasswordToken, password) => {
    const user = await db.usuarios.findUnique({
        where: {
            resetPasswordToken
        }
    })

    if (!user) {
        throw new Error("Usuario no encontrado")
    }

    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry
    if (!resetPasswordTokenExpiry) {
        throw new Error("Token expiró")
    }

    const today = new Date()

    if (today > resetPasswordTokenExpiry) {
        throw new Error("Token expiró")
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    await db.usuarios.update({
        where: {
            Id: user.Id // Usar 'Id' con mayúscula
        },
        data: {
            password: passwordHash, // Actualizar el campo 'password' en lugar de 'passwordHash'
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null
        }
    })

    return "Contraseña cambiada exitosamente"
}
