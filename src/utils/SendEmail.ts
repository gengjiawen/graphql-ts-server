import * as nodemailer from 'nodemailer'
import { Redis } from 'ioredis'
import { v4 } from 'uuid'

export const sendEmail = async (recipient: string, url: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'xxsncqleb2roddtg@ethereal.email',
      pass: 'xDK34xTytg6Pfve6ya',
    },
  })

  const message = {
    from: 'Sender Name <sender@example.com>',
    to: `Recipient <${recipient}>`,
    subject: 'Nodemailer is unicode friendly ✔',
    text: 'Hello to myself!',
    html: `<html>
        <body>
        <a href="${url}">confirm email</a>
        </body>
        </html>`,
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err.message)
    }

    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}

export const createConfirmEmailLink = async (url: string, userId: string, redis: Redis) => {
  const id = v4()
  await redis.set(id, userId, 'ex', 24 * 60 * 60)
  return `${url}/confirm/${id}`
}