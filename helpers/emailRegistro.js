import nodemailer from 'nodemailer';

const emailRegistro = async (datos) =>{
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
    });

    const {email, nombre, token} = datos;
    
    //Enviar el email
    const info =  await transporter.sendMail({
        from: 'Innovatextil - Donde la innovación se teje en cada hilo. Calidad y creatividad para vestir tus sueños.',
        to: email,
        subject: 'Comprueba tu cuenta en InnovaTextil',
        text: 'Comprueba tu cuenta en InnovaTextil',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en InnovaTextil.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Comprobar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    });

    console.log('Mensaje enviado: %s', info.messageId);
    
}

export default emailRegistro;
