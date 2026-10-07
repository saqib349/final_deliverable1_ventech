import nodemailer from 'nodemailer';

const auther = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, 
    auth: { 
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}); 

export const sendEmail = async (recipient,name,text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Welcome!',
    text: text || `Hello ${name}, welcome to our todo app!`
  };

  try {
    await auther.sendMail(mailOptions); 
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
