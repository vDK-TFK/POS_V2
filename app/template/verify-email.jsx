import * as React from "react"

export const VerifyEmailTemplate = ({ email, emailVerificationToken }) => (
    <div>
        <h1>
            Verificar el correo para: <b>{email}</b>
        </h1>
        <p>Para verificar su email, entre a este link:</p>
        <a
            href={`/auth/verificar-email?token=${emailVerificationToken}`}
        >
            Clic aquí para verificar su email
        </a>
    </div>
)
