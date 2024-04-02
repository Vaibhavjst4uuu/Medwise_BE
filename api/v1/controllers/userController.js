const db = require("../models/index");
const { Op } = require("sequelize");
const validator = require("../utils/validateCredentials");
const { FileUpload, DeleteFile } = require("../utils/uploadFiles");



let User_has_role = db.user_has_role;
let Users = db.user;
let Roles = db.role;

const updateUser = async (req, res) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }

    let user = await Users.update(req.body, {
      where: { id: id },
      attributes: { exclude: ['password'] }
    });
    if(user[0] === 1){
      return res.status(200).json({ message: "user updated sucessfully"});
    }else{
      return res.status(404).json({message:"no data available for update user"});
    }
  } catch (e) {
    res.status(400).json(validator.validate(e));
  }
};

const findAllUsers = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit =parseInt(req.query.limit)||10;
  let offset = (page - 1) * limit;
  try {
    let count = await Users.count();
    let users = await Users.findAll({
      where:{
        status:"active"
      },
      include: [{ model: Roles }, { model: db.medical_practice, as: 'preferredMedicalPractice' }],
      limit: limit,
      offset: offset,
      attributes: { exclude: ['password'] }
    });
    if (!users || users.length === 0) throw new Error("No Users Found!");

    res.status(200).json({
      statusCode:200,
      responseCode: 'SUCCESS',
      message: 'Users Retrieved Successfully!',
      data:users,
      pagination:{
        totalItems: count,
        totalpage:Math.ceil(count/limit),
        currentPage: page,
        nextPage: Math.min(page + 1, Math.ceil(count / limit)),
        previousPage: Math.max(1, page - 1),
        limit:limit
      }
    });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: err.message||"Error Occured!",
    });
  }
};

const findUserById = async(req,res)=>{
  let id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }
  try {
    let user = await Users.findOne({
      where:{
        id:id
      },
      attributes: { exclude: ['password'] }
    });
    if(!user){
      throw new Error(`User with ID "${id} does not exist.`);
    }
    res.status(200).json({
      statusCode:200,
      responseCode: 'SUCCESS',
      message: "User Details Retreived.",
      data:user
    });
  } catch (error) {
    res.status(400).json({
      statusCode:400,
      responseCode: 'ERROR',
      message: error.message || "unable to find user"
    })
  }
}

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }

try {
  const user = await Users.findOne( {where : {id:id}} );
  if(!user){
    res.status(400).json({
      statusCode:400,
      responseCode: 'USER_NOT_FOUND',
      message:'No User Found.'
    });
    return;
  }
  user.status = "inactive";
  await user.save();
  // const result = await Users.destroy({
  //   where: {
  //     id: id,
  //   },
  //   returning: true, // so it returns the deleted property
  // });
    // if(result == 1){
    //   if(user && user.login_img!==''){
    //     await DeleteFile(user.login_img);
    //   }
    //   res.status(200).json({
    //     statusCode:200,
    //     responseCode: 'SUCCESS',
    //     message: `Deactivated User successfully`,
    //   })
    // }else{
    //   throw new Error( "User not found!" );
    // }
    res.status(200).json({
      statusCode:200,
      responseCode: 'SUCCESS',
      message: `Deactivated User successfully`,
    })
} catch (error) {
  res.status(400).json({
    statusCode: 400,
    responseCode:'FAILURE',
    message:`Failed to Deactivate User with ID ${id}`||error.message ,
  })
}

};

const assignRole = async (req, res) => {
  
  try {
    if(!req.body.userId || !req.body.roleId){
      throw new Error("unable to find user or role");
    }
    if (isNaN(userId) || isNaN(roleId)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }
    let data = await User_has_role.findOrCreate({
      where: {
        userId: req.body.userId,
        roleId: req.body.roleId,
      },
      defaults: {
        userId: req.body.userId,
        roleId: req.body.roleId,
      },
    });

    let del = await User_has_role.destroy({
      where: {
        UserId: req.body.userId,
        roleId: {
          [Op.not]: req.body.roleId,
        },
      },
    });

    // res.json(data);
    res.status(200).json({
      statusCode: 200,
      responseCode: "SUCCESS",
      message: "Role assigned successfully",
    });
  } catch (error) {
    // console.error(error);
    res.status(400).json({
      statusCode: 400,
      responseCode: "Error",
      message: error.message||`An error occurred while processing your request`,
    });
  }
};

const userSpecificRole = async (req, res) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }
    let data = await User_has_role.findOne({
      where: {
        UserId: id,
      },
      include: [db.role],
    });
    if (!data) {
      throw new Error("User does not have a Role");
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
    // console.error(err);
  }
};

const addUserConsultedDoctors = async(req,res) =>{
    try {
      const data = await db.user_consulted_doctor.create(req.body);

      if(!data){
        throw new Error("please check the data and try again");
      }

      res.status(201).json({
        statusCode: 201,
        responseCode: 'Created',
        message:'Data has been added successfully' ,
        data:data
      })
    } catch (error) {
      res.status(400).json(validator.validate(error));
    }
}

const getUserConsultedDoctors = async(req,res)=>{
    const id = Number(req.params.user_id);
    if (isNaN(id)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;

    try {
      const count = await db.user_consulted_doctor.count({
        where: { user_id: id },
      })
      const data = await db.user_consulted_doctor.findAll({
        where:{
          user_id:id
        },
        limit:limit,
        offset:offset
      });
      if(data.length === 0){
        throw "No consultation history found for this User";
      }else{
        res.status(200).json({
          statusCode:302,
          responseCode: 'Found',
          message:"Successfully fetched consultation history",
          data:data,
          pagination:{
            totalItems: count,
            totalpage:Math.ceil(count/limit),
            currentPage: page,
            nextPage: Math.min(page + 1, Math.ceil(count / limit)),
            previousPage: Math.max(1, page - 1),
          }
        });
      }
    } catch (error) {
      res.status(400).json({
        statusCode:400,
        responseCode: 'Bad Request',
        message: error.message ||  "Server Error"
      });
    }
}

const addOrChangeProfile_pic = async(req,res)=>{
  const id= Number(req.params.id);
  if (isNaN(id)) {
    // Handle the case where req.params.id is not a valid number
    // For example, you could send a 400 Bad Request response
    res.status(400).send('Invalid ID parameter');
    return;
  }

  try {
    const user = await Users.findOne({
      where:{
        id:id
      },
      attributes:["profile_pic","id"]
    });
    if(!user || !req.files){
      throw new Error ("User not Found! or no profile_pic provided");
    }

    if(user.profile_pic!==null){
      await DeleteFile(user.profile_pic);
      // console.log(req.files);
      if(req.files.profile_pic){
        var img = await FileUpload(req.files.profile_pic, "uploads/profile_pic/");
      }
    }else{
      if(req.files.profile_pic){
        var img = await FileUpload(req.files.profile_pic, "uploads/profile_pic/");
      }
    }
    user.profile_pic = img.filepath;
    await user.save();
    res.status(200).json({
      statusCode:200,
      responseCode: 'OK',
      message: "Profile Picture Uploaded Successfully",
      data:img.filepath
    });
  } catch (error) {
    res.status(400).json({
      statusCode:400,
      responseCode: 'Bad Request',
      message: error.message || "unable to add/change Profile picture" ,
    });
  }
}




module.exports = {
  assignRole,
  userSpecificRole,
  updateUser,
  findAllUsers,
  deleteUser,
  findUserById,
  addUserConsultedDoctors,
  getUserConsultedDoctors,
  addOrChangeProfile_pic
  
};
