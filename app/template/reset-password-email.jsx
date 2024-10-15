import * as React from "react"

export const ResetPasswordEmailTemplate = ({ email, resetPasswordToken }) => (
    <div>
        <h1>
            Reiniciar la contraseña para: <b>{email}</b>
        </h1>
        <p>
            Para reiniciar su contraseña, haga clic en este link y siga las instrucciones:
        </p>
        <a
            href={`/auth/reset?token=${resetPasswordToken}`}
        >
            Clic aquí para reasignar la contraseña
        </a>
    </div>
)
