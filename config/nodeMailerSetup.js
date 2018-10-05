const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "smnv", // generated ethereal user
        pass: "sayempu1998"// generated ethereal password
    }
});

module.exports = transporter;