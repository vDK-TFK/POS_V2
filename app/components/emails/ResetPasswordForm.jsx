"use client"
import React, { useState } from "react"
import { resetPassword } from "@/app/api/auth/resetPassword/resetPassword"

const ResetPasswordForm = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async () => {
        try {
            if (!email) {
                setMessage("Por favor, ingresa un correo electrónico.")
                return
            }

            const responseMessage = await resetPassword(email)
            setMessage(responseMessage)
        } catch (error) {
            setMessage(error.message || "Hubo un error al intentar reiniciar la contraseña.")
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1>Reasignar Contraseña</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button onClick={handleSubmit}>Reiniciar contraseña</button>
            <p>{message}</p>
        </div>
    )
}

export default ResetPasswordForm
