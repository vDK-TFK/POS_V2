import ChangePasswordForm from "@/app/components/emails/ChangePasswordForm"
import ResetPasswordForm from "@/app/components/emails/ResetPasswordForm"
import prisma from "@/app/lib/db"
import React from "react"

const ResetPasswordPage = async ({ searchParams }) => {
    if (searchParams.token) {
        const user = await prisma.usuarios.findUnique({
            where: {
                resetPasswordToken: searchParams.token
            }
        })
        if (!user) {
            return <div>Token Inválido</div>
        }

        return <ChangePasswordForm resetPasswordToken={searchParams.token} />
    } else {
        return <ResetPasswordForm />
    }
}

export default ResetPasswordPage
