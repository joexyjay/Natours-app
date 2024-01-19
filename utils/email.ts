import nodeMailer from 'nodemailer';

const sendEmail = async (options: any) => {
    // 1) Create a transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD
        },
        // tls: {
        //     ciphers:'SSLv3'
        // }
    } as nodeMailer.TransportOptions)

    // 2) Define the email options
    const mailOptions = {
        from: 'Natours <natours@mail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
}

export default sendEmail;