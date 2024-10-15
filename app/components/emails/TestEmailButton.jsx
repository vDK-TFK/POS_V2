"use client"
import React from "react"
import { sendEmail } from "../api/emails/sendEmail"
import { EmailTemplate } from "../components/emails/EmailTemplate"

const TestEmailButton = () => {
    const handleSubmit = async () => {
        sendEmail({
            from: "Acme <onboarding@resend.dev>",
            to: ["josueuniv09@gmail.com"],
            subject: "Test Email",
            // text: 'This is a test email',
            // html: '<h1>This is a test email</h1>'
            react: EmailTemplate({ firstName: "Josue" })
        })
    }

    return <button onClick={handleSubmit}>Send Test Email</button>
}

export default TestEmailButton
