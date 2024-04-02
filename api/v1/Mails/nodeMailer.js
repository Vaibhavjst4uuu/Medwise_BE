const nodemailer = require("nodemailer");
require("dotenv").config();
let path = require('path');
let ejs = require('ejs');

// console.log(process.env.user);
// console.log(process.env.pass);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

const sendRegistrationEmail = async(userName,userEmail) => {
    //saving path of my template in template variable
  const template = path.join(__dirname,"../Views/registrationEmailTemplate.ejs");

  //rendering data inside data variable to pass it to HTML in mail option
  const data = await ejs.renderFile(template, {userName,userEmail});

  const mailOptions = {
    from: {
      name: "MedWise",
      address: process.env.user,
    },
    to: userEmail,
    subject: "Welcome to our MedWise",
    html: data
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendResetLink = async(userEmail,userName, resetToken)=>{
  // console.log(resetToken,userEmail,userName);
  let url=`http://localhost:3000/auth/reset-password-page?token=${resetToken}`;
  
  const resetTemplate=path.join(__dirname,'../Views/resetPassword.ejs');
  const resetLink={url} 
  const message=await ejs.renderFile(resetTemplate,{resetLink,userName});
  // console.log(resetLink);
  const options={
    from:{
      address:process.env.user,
      name:"MedWise"
    },// sender address
    to:userEmail,
    subject:'Medwise reset Password',
    html:message
    }

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

  }
module.exports = {
  sendRegistrationEmail,sendResetLink
}
