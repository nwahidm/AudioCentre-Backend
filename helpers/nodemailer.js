const nodemailer = require('nodemailer')

const send = (email) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    let mailOption = {
        from: 'audiocentre@gmail.com',
        to: `${email}`,
        subject: 'Welcome to Audio Centre',
        html: `<h1>Thanks for register, (Note: ini nanti diisi link untuk aktivasi akun)</h1>`
    }

    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
        }
    })
}

module.exports = send