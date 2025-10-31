import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendAccountVerifiedEmail = async (to, userName) => {
  const mailOptions = {
    from: `"Credit Jambo" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Credit Jambo Account Has Been Verified ✅",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hello <b>${userName}</b>,</p>

        <p>We’re happy to let you know that your <b>Credit Jambo</b> account has been successfully verified! 🎉</p>
        <p>You can now log in and start exploring all our features.</p>

        <br/>
        <p>If you didn’t request this verification, please contact our support team immediately.</p>

        <br/>
        <p>Best regards,<br/>
        <b>The Credit Jambo Team</b></p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
  console.log(`✅ Verification email sent to ${to}`)
}
