import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transportConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass)
let transport = null

if (transportConfigured) {
  transport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort || 587,
    secure: env.smtpSecure || env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  })

  transport
    .verify()
    .then(() => {
      console.log('SMTP transport verified for host:', env.smtpHost)
    })
    .catch((error) => {
      console.error('SMTP transport verification failed:', error)
    })
}

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transportConfigured || !transport) {
    throw new Error(
      'SMTP transport is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment.'
    )
  }

  const mailOptions = {
    from: env.emailFrom,
    to,
    subject,
    text,
    html
  }

  return transport.sendMail(mailOptions)
}
