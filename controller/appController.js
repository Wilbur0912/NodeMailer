const nodemailer = require('nodemailer');

const Mailgen = require('mailgen');


const {EMAIL, PASSWORD} = require('../env.js');

const Mail = require('nodemailer/lib/mailer/index.js');

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
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    });

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Successfully register with us.", // plain text body
        html: "<b>Successfully register with us.</b>", // html body
    }

    transporter.sendMail(message).then((info) => {
        return res.status(201).json({
            msg: "you should receive an email",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error=>{
        return res.status(500).json({error})
    })

    //res.status(201).json("Signup Sucessfully");
}
/** send maile from real gmail account */
const getBill = (req, res) => {
    
    const {userEmail} = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name: "Daily tuition",
            intro: "Your bill has arrived",
            table: {
                data: [
                    {item: "Nodemailer Stack Book",
                    description: "A Backend application",
                    price: "$10.99",}
                ]
            },
            outro: "Looking forward to do more business"
        }
    }

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Place Order",
        html: mail
    }

    transporter.sendMail(message).then(()=>{
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({error})
    })

    //res.status(201).json("getBill Sucessfully");
}

module.exports = {
    signup,
    getBill
}