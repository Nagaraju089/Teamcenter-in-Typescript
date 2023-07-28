import nodemailer, { TransportOptions } from 'nodemailer'

export async function sendEmail(emailData: any) {
    if(emailData){
      //console.log(emailData)
    
    const transporter = nodemailer.createTransport({
     // host: process.env.EMAIL_HOST,
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
  else{
    console.log("No proper data");
  }
  }
