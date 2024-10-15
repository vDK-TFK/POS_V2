import prisma from "@/app/lib/db"
import React from "react"

const VerifyEmailPage = async ({ searchParams }) => {
    if (searchParams.token) {
        const user = await prisma.usuarios.findUnique({
            where: {
                emailVerificationToken: searchParams.token
            }
        })
        if (!user) {
            return <div>Token Inválido</div>
        }

        await prisma.usuarios.update({
            where: {
                emailVerificationToken: searchParams.token
            },
            data: {
                emailVerified: true,
                emailVerificationToken: null
            }
        })

        return (
            <div>
                <h1>
                    Su correo ha sido verificado con éxito: <b>{user.email}</b>!
                </h1>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Verificar email</h1>
                No se ha encontrado un token para verificar el email. Revise su correo.
            </div>
        )
    }
}

export default VerifyEmailPage
