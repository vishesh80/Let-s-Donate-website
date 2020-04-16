const nodemailer = require("nodemailer");

async function mail(data)
{
    let TR = nodemailer.createTransport({
        service: 'gmail',
        auth: { user:'letsdonate1998@gmail.com', pass: String(process.env.PASS)}
    });

    let mailInfo = {
    from: "letsdonate1998@gmail.com",
      to: data.email,
      subject: "OTP (LET's DONATE)",
      text: "\n\nOTP: " + data.number,
    };

    return await TR.sendMail(mailInfo,(err,data) => {

        if(err)
        {
            throw new Error("Node mailer Failed to send the email");
        }
        else return "Mail sent";
    });
}


async function getmail(data) {
    let TR = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'letsdonate1998@gmail.com', pass: String(process.env.PASS) }
    });

    let mailInfo = {
        from: data.email,
        to: 'letsdonate1998@gmail.com',
        subject: "Contact (LET's DONATE)",
        text: 'Name : ' + data.name + '\n\nEmail : '+ data.email+'\n\n\n'+data.desc+'',
    };


    return await TR.sendMail(mailInfo, (err, data) => {

        if (err) {
            throw new Error("Nodemailer Failed.");
        }
        else return;
    });
}


module.exports.mail = mail;
module.exports.getmail = getmail;