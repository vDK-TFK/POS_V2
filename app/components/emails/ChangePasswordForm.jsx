"use client"
import React, { useState } from "react"
import { changePassword } from "@/app/api/auth/resetPassword/changePassword"

const ChangePasswordForm = ({ resetPasswordToken }) => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [message, setMessage] = useState("")

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setMessage("Contraseñas no coinciden")
            return
        }

        const message = await changePassword(resetPasswordToken, password)

        setMessage(message)
    }

    return (
        <div>
            <h1>Cambiar Contraseña</h1>
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Cambiar Contraseña</button>
            <p>{message}</p>
        </div>
    )
}

export default ChangePasswordForm
