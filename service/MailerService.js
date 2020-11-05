const nodemailer = require("nodemailer");

/* 
  Service class with functionality related to 
  sending email using external mail agents
*/
class MailerService {
  constructor() {
    // configure nodemailer once and use it in any methods of MailerService
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      auth: {
          user: process.env.MAILER_AUTH_USER,
          pass: process.env.MAILER_AUTH_PASS
      }
    })
  }

  /*
    Function that takes mail parameters and 
    initiates mail send Promise 
   */
  sendMail(mail_object) {
    const {
      from,
      to,
      subject,
      text,
      html
    } = mail_object; 

    return new Promise((resolve, reject) => {
      console.log("MailerService: calling mail send api ...")
      this.transporter.sendMail(
        {
          from,
          to,
          subject,
          text,
          html
        }
      ).then(()=>{
        console.log("MailerService: send mail success")
        resolve();
      }).catch((err)=>{
        console.log("MailerService: Failed to send Mail", err);
        reject(err);
      })
    })
  }
}

module.exports = MailerService;