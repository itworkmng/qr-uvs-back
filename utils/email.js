const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_PASSWORD,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  var mailOptions = {
    from: `Цахим Увс Систем <${process.env.SMTP_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    text: options.text,
  };

  const info = await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info;
};

module.exports = sendEmail;
