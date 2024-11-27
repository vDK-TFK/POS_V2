"use server"

import db from "@/app/lib/db"
import crypto from "crypto"
import { sendEmail } from "@/app/api/emails/sendEmail"
import { ResetPasswordEmailTemplate } from "@/app/template/reset-password-email"

export const resetPassword = async correo => {
  console.log("Reiniciando contraseña para: " + correo)

  // Buscar el usuario por email
  const user = await db.usuarios.findUnique({
    where: {
      correo
    }
  })

  // Si no se encuentra el usuario, lanzar un error
  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  // Generar un token de restablecimiento de contraseña
  const resetPasswordToken = crypto.randomBytes(32).toString("base64url")
  const today = new Date()
  const expiryDate = new Date(today.setDate(today.getDate() + 1)) // 24 horas a partir de ahora

  // Actualizar el usuario con el token y la fecha de expiración
  await db.usuarios.update({
    where: {
      idUsuario: user.idUsuario // Cambia 'Id' por 'idUsuario'
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expiryDate
    }
  })
  

  // Enviar el correo electrónico con el token de restablecimiento
  await sendEmail({
    from: "Pollo Petote <onboarding@resend.dev>",
    to: [correo],
    subject: "Reinicie su contraseña",
    react: ResetPasswordEmailTemplate({ correo, resetPasswordToken })
  })

  return "Password reset email sent"
}
