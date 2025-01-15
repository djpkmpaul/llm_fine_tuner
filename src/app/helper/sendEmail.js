// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use Gmail's service for simplicity
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.MAILTRAP_PASSWORD,
//   },
// });

// async function sendEmail(toEmail) {
//   try {
//     // Send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER, // Sender address
//       to: toEmail, // Receiver's email
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // Plain text body
//       // html: "hey there <b>Hello world?</b>", // Uncomment for HTML email
//     });

//     console.log("Message sent: %s", info.messageId); // Log message ID for debugging
//     console.log(`Email sent to: ${toEmail}`); 
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error('Failed to send email');
//   }
// }

// export default sendEmail;
