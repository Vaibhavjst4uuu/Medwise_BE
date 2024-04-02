const db = require("../models/index");
const jwt = require("jsonwebtoken");
const crypto = require( "crypto" );
const bcrypt = require("bcrypt");
const validator = require("../utils/validateCredentials");
const { FileUpload, DeleteFile } = require("../utils/uploadFiles");
const { calculateEuclideanDistance } = require('../utils/faceComaprision');
const { sendRegistrationEmail, sendResetLink} = require("../Mails/nodeMailer");



require("dotenv").config();


const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res) => {
  // const {password , ...userData} = req.body;
  let loginImage;
  try {
    if (req.files && req.files.login_img) {
      loginImage = await FileUpload(req.files.login_img, "uploads/login_img/");
      req.body.login_img = await loginImage.filepath;
    }

    const user = await db.user.create(req.body);
    const assignRole= await db.user_has_role.create({
      userId: user.id,
      roleId:process.env.userRole
    });
    // console.log("i am hitting");
    sendRegistrationEmail(`${user.fName} ${user.lName}`,user.email);

    res.status(201).json({
      statusCode: 201,
      responseCode: "CREATED",
      message: "User created successfully!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    if (loginImage && loginImage.filepath) {
      await DeleteFile(loginImage.filepath);
    }
    res.status(409).json(validator.validate(error));
  }
};

const login = async (req, res) => {
  // let temporaryImg;
  try {
    const { email, password } = req.body;
    const user = await db.user.findOne({
      where: {
        email: email,
      },
      include: [db.role,{model:db.medical_practice, as:'preferredMedicalPractice'}]
    });
    // console.log('user:', user);

    // console.log(req.files.tempImg);
    if(req.files!==null && req.files !== undefined){
      const tempImg = await FileUpload(req.files.tempImg, "uploads/temporary_img/");
      var result = await calculateEuclideanDistance(user.login_img, tempImg.filepath);
      await DeleteFile(tempImg.filepath);
    }else{
      if (!user) {
        res.status(401).json({
          statusCode: 401,
          responseCode: "UNAUTHORIZED",
          message: "Invalid Email",
        });
        return;
      }else if(user.status === 'inactive'){
        throw new Error("Your account is deactivated by admin.");
        
      } else if (
        user &&
        user.roles[0] &&
        user.roles[0].name &&
        (user.roles[0].name == "Admin" || user.roles[0].name == "Super Admin")
      ) {
        res.status(401).json({
          statusCode: 401,
          responseCode: "UNAUTHORIZED",
          message: "only user can  access this login portal.",
        });
        return;
      }
      var passwordMatch = await bcrypt.compare(password, user.password);
    }

    // res.json(user);
    console.log(passwordMatch);
    if (passwordMatch === false || result >= 0.45 ) {
      res.status(401).json({
        statusCode: 401,
        responseCode: "UNAUTHORIZED",
        message: "Invalid Email or Password or Image Matching Failed",
      });
      return;
    } else {
      const payloads = {
        id: user.id,
        email: user.email,
        role: user.roles[0] ? user.roles[0].name : "",
        // exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };

      // const options = { expiresIn: '1h' };
      const token = jwt.sign(payloads, SECRET_KEY); //
      //removing password field from the user output
      delete user.dataValues.password;
      const addToken = await db.UserLoginTokens.create({
        userId: user.id,
        token: token,
      });
      res.status(200).json({
        responseCode: 200,
        responseStatus: "Success",
        message: "Logged in Successfully",
        token: token,
        data: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      statusCode: 400,
      responseCode: "server error",
      message: error.message||"Internal Server Error",
    });
  }
};

const AdminLogIn = async (req, res) => {
  const { email, password } = req.body;

  // Compare a password to a hash
  try {
    let Data = await db.user.findAll({
      where: {
        email: email,
        // password: password,
      },
      include: [db.role],
    });
    // console.log(Data);
    // console.log(!Data[0] && !Data[0]?.password);
    if(!Data[0] && !Data[0]?.password ){
      throw new Error( 'invalid Email' );
    }else if(Data[0].status === 'inactive'){
      throw new Error("Your account is deactivated by admin.");
    }
    const passwordMatch = await bcrypt.compare(password, Data[0].password);
    // console.log(!Data && Data.length <= 0 && !Data[0] && !Data[0]?.password );
    if (!Data && Data.length <= 0 ) {
      res.status(401).json({
        statusCode: 401,
        responseCode: "unauthorized",
        message: "Invalid Password or Username",
      });
      return;
    } else if (!passwordMatch) {
      res.status(401).json({
        statusCode: 403,
        responseCode: "forbidden",
        message: "Wrong Password",
      });
      return;
    } else {
      if(
        !Data &&
        !Data.length > 0 &&
        !Data[0].roles &&
        !Data[0].roles.length > 0 &&
        !Data[0].roles[0]?.name
      ){
        res.status(400).json({
          statusCode: 400,
          responseCode: "bad_request",
          message: `Sorry ${Data[0].fName} only admin can login on this portal`,
        });
        return;
      }
      // console.log(!Data[0].roles.length === 0);
      if (
       Data[0].roles[0].name == "Admin" ||
       Data[0].roles[0].name == "Super Admin"
      ) {
        const payloads = {
          id: Data[0].id,
          email: Data[0].email,
          role: Data[0].roles[0] ? Data[0].roles[0].name : "",
          // exp: Math.floor(Date.now() / 1000) + 60 * 600,
        };
        const token = jwt.sign(payloads, SECRET_KEY); //
        delete Data[0].dataValues.password;
        // delete Data[0].dataValues.roles;
        const addToken = await db.UserLoginTokens.create({
          userId: Data[0].id,
          token: token,
        });
        res.status(200).json({
          responseCode: 200,
          responseStatus: "Success",
          message: "Logged in Successfully",
          token: token,
          data: Data,
        });
        return;
      } else {
        res.status(400).json({
          statusCode: 400,
          responseCode: "bad_request",
          message: `Sorry ${Data[0].fName} only admin can login on this portal`,
        });
      }
    }
  } catch (error) {
    // console.error(error);
    res.status(400).json({
      statusCode: 400,
      responseCode:"failed",
      message:error.message
    })
  }
  
};

const forget_password = async(req,res)=>{
  try {

    const resetToken = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex');
    // console.log("Reset Token : ",resetToken);
    let user = await db.user.findOne({
      where:{
        email:req.body.email
      },
      attributes:["id","fName","email", "resetToken"]
    });
    // console.log("user:",user);
    if(!user){
      res.status(200).json({
        statusCode: 400,
        responseCode: 'not_found',
        message:'User not found with given credentials'
      });
      return;
    }

    user.resetToken=resetToken;
    await user.save();

    sendResetLink(user.email, user.fName, resetToken);
    res.status(200).json({
      statusCode:200,
      responseCode: 'success',
      message: 'Email for reset password sent successfully.'
    })

  } catch (error) {
    // console.error(error);
    res.status(200).json({
      statusCode:500,
      responseCode:"server_error",
      data:null,
      message: "Internal Server Error "
    })
  }
}

const verifyresetToken = async(req,res)=>{
  const { resetToken } = req.body;

  if(!resetToken || typeof resetToken !== "string" || resetToken === " "){
    res.status(400).json({
      statusCode: 400,
      responseCode: 'bad_request',
      message: `Invalid request. Please provide a valid token.`
    });
    return;
  }
  const verifyresetToken = await db.user.findOne({
    where:{
      resetToken:resetToken
    }
  });
  // console.log(verifyresetToken);
  if(!verifyresetToken){
    res.status(401).json({
      statusCode: 401,
      responseCode:'invalid_token',
      message:`The provided token is invalid or has expired`
    });
    return;
  }else{
    //update the user's passwordReset field to false and save it in the database
    res.status(200).json({
      statusCode:200,
      responseCode:"ok",
      message: "Valid Token.",
    });
  }

}


const resetPassword = async(req,res)=>{
  const { newPassword, confirmPassword, resetToken} = req.body;
  try {
    if(!resetToken || typeof resetToken !== "string" || resetToken === " "){
      res.status(400).json({
        statusCode: 400,
        responseCode: 'bad_request',
        message: `Invalid request. Please provide a valid token.`
      });
      return;
    }
    if(!newPassword || !confirmPassword) {
      throw new Error("Please fill out all fields.");
    }
    const user = await db.user.findOne({
      where:{
        resetToken:resetToken
      }
    });

    // if(user.resetToken !== resetToken) throw new Error("Invalid token");

    if(newPassword!==confirmPassword){
      res.status(400).json({
        statusCode : 400 ,
        responseCode:'invalid_password',
        message:`The provided passwords do not match.`
      });
    }else{
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        statusCode: 200,
        responseCode: 'success',
        message: `Your password has been successfully updated. You can now login with your new password.`
      })
    }

  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      responseCode:"error occured",
      message: error.message ||  "Error Occurred."
    })
  }
}

const logOut = async(req,res)=>{
try {
  if(req.headers && req.headers.authorization){
    var token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      responseCode:"UNAUTHORIZED",
      message: "No token provided"
    }); // Unauthorized
    
  }

  const userToken = await db.UserLoginTokens.destroy({
    where:{
      token:token
    },
    returning: true
  });
  // console.log(userToken);
  if(userToken=== 1){
    res.status(200).json({
      statusCode: 200,
      responseCode: 'logged out',
      message: "logged out successfully."
    });
    return;
  }else{
    res.status(403).json({
      statusCode: 403,
      responseCode:'FORBIDDEN',
      message: "Invalid or expired token."
      }); // Forbidden
  }
} catch (error) {
  res.status(400).json({
    statusCode: 500,
    responseCode: 'INTERNAL_SERVER_ERROR',
    message: "Internal server error.",
    error:error
  })
}
}

const logOutFromAll = async(req,res)=>{
  try {
    const deleteAllTokens = await db.UserLoginTokens.destroy({
      where:{
        userId:req.user.id
      },
      returning:true
    });
    console.log(deleteAllTokens);
    if(deleteAllTokens > 0){
      return res.status(200).json({
        statusCode: 200,
        responseCode: 'LOGOUT_ALL',
        message: `Logged out from all devices.`
      });
    }else{
      throw new Error("No tokens found for the user.");
    }
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      responseCode: 'BAD_REQUEST',
      message: error.message || "unable to logout from all devices"
    });
  }
}

module.exports = {
  signup,
  AdminLogIn,
  login,
  forget_password,
  verifyresetToken,
  resetPassword,
  logOut,
  logOutFromAll
};
