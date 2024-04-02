// const express = require('express');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const db = require("../models/index");


const secretKey = process.env.SECRET_KEY;


// Middleware to verify JWT and extract user role
async function authenticateToken(req, res, next) {
  if(req.headers && req.headers.authorization){
    var token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      responseCode:"UNAUTHORIZED",
      message: "No token provided"
    }); // Unauthorized
  }

  const userToken = await db.UserLoginTokens.findOne({
    where:{
      token: token
    }
  });

  if(!userToken){
    return res.status(403).json({
      statusCode: 403,
      responseCode: "FORBIDDEN",
      message: "Invalid or expired token."
      }) // Forbidden
  }
  // console.log(secretKey);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        statusCode: 403,
        responseCode: "FORBIDDEN",
        message: "Invalid or expired token"
      }); // Forbidden
    }

    req.user = user;
    next();
  });
}

function checkAdminRole(req, res, next) {
    const userRole = req.user.role;
  
    if (userRole === 'Admin' || userRole === 'Super Admin') {
      next(); // Allow access to the next middleware or route handler
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  }


  module.exports ={
    authenticateToken,
    checkAdminRole
  }


