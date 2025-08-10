import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendEmail = async (params: {
  to: string
  subject: string
  html: string
  from?: string
}) => {
  try {
    await sgMail.send({
      to: params.to,
      from: params.from || 'noreply@mhealthtimes.com',
      subject: params.subject,
      html: params.html,
    })
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send email')
  }
}

export const emailTemplates = {
  articleSubmission: (articleTitle: string, authorName: string) => ({
    subject: 'Article Submission Confirmation - MHealthTimes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Article Submission Confirmation</h2>
        <p>Dear ${authorName},</p>
        <p>Thank you for submitting your article "<strong>${articleTitle}</strong>" to MHealthTimes.</p>
        <p>Your article has been received and is currently under review. We will notify you once the review process is complete.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>The MHealthTimes Team</p>
      </div>
    `
  }),
  
  interviewBooking: (kolName: string, scheduledTime: string, duration: number) => ({
    subject: 'Interview Booking Confirmation - MHealthTimes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Interview Booking Confirmation</h2>
        <p>Your interview with <strong>${kolName}</strong> has been successfully scheduled.</p>
        <p><strong>Date & Time:</strong> ${scheduledTime}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p>We will send you a calendar invitation and meeting link shortly.</p>
        <br>
        <p>Best regards,<br>The MHealthTimes Team</p>
      </div>
    `
  }),
  
  paymentConfirmation: (amount: number, description: string) => ({
    subject: 'Payment Confirmation - MHealthTimes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payment Confirmation</h2>
        <p>Thank you for your payment of $${amount} for ${description}.</p>
        <p>Your transaction has been processed successfully.</p>
        <br>
        <p>Best regards,<br>The MHealthTimes Team</p>
      </div>
    `
  })
}
