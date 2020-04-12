const nodemailer = require("nodemailer");

async function mail(data)
{
    let TR = nodemailer.createTransport({
        service: 'gmail',
        auth: { user:'guptaarnav890@gmail.com', pass: String(process.env.PASS)}
    });

    let mailInfo = {
      from: "Let's Donate",
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
        auth: { user: 'guptaarnav890@gmail.com', pass: String(process.env.PASS) }
    });

    let mailInfo = {
        from: data.email,
        to: 'guptaarnav890@gmail.com',
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