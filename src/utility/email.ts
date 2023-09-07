import nodemailer, { TransportOptions } from 'nodemailer'

export async function sendEmail(emailData: any) {
  if (emailData) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,

      },
    } as TransportOptions);

    await transporter.sendMail(emailData);
  }
  else {
    console.log("No proper data");
  }
}
