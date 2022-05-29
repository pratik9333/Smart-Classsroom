const nodemailer = require("nodemailer");

exports = async (
  senderName,
  senderEmail,
  senderPass,
  receiversData,
  subject,
  aditionalInfo
) => {
  // if('user' in aditionalInfo)
  //   const {user} = aditionalInfo;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: senderEmail,
      pass: senderPass,
    },
  });

  const emailPromises = [];

  for (let eachUser of receiversData) {
    emailPromises.push(
      transporter.sendMail({
        from: `"${senderName} ${senderEmail}`, // sender address
        to: eachUser.email, // list of receivers
        subject: subject, // Subject line
        html: `
        Hello ${eachUser.fullName}, Welcome to smart classroom! <br> You have been added to a class by your class teacher ${user.fullName}. 

        Please use the following credentials to access your class.

        Username: ${eachUser.email}
        Password: ${eachUser.password}

        `, // html body
      })
    );
  }

  return emailPromises;
};
