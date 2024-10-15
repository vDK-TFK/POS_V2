"use server"

import db from "@/app/lib/db"
import crypto from "crypto"
import { sendEmail } from "@/app/api/emails/sendEmail"
import { ResetPasswordEmailTemplate } from "@/app/template/reset-password-email"

export const resetPassword = async email => {
  console.log("Reiniciando contraseña para: " + email)

  // Buscar el usuario por email
  const user = await db.usuarios.findUnique({
    where: {
      email
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
      Id: user.Id // Usar 'Id' con mayúscula
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expiryDate
    }
  })

  // Enviar el correo electrónico con el token de restablecimiento
  await sendEmail({
    from: "Pollo Petote <onboarding@resend.dev>",
    to: [email],
    subject: "Reinicie su contraseña",
    react: ResetPasswordEmailTemplate({ email, resetPasswordToken })
  })

  return "Password reset email sent"
}
