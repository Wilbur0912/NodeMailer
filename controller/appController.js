const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({msg: "you should receive an email"})
    }).catch(error=>{
        return res.status(500).json({error})
    })

    //res.status(201).json("Signup Sucessfully");
}

const getBill = (req, res) => {
    res.status(201).json("getBill Sucessfully");
}

module.exports = {
    signup,
    getBill
}