const db = require("../models/index");
const { Op } = require("sequelize");

const validator = require("../utils/validateCredentials");

const addChat = async (req, res) => {
  
  try {
    const chat = await db.chat_logs.create(req.body);
    if (!chat) {
      res.status(400).json({ msg: "Failed to create Chat" });
    } else {
      res.status(201).json({
        statusCode: 201,
        responseCode: "SUCCESS",
        msg: "Chat Created Successfully.",
        data: {
          chat: chat,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(validator.validate(error));
  }
};

const getAllChatsByUser_id = async(req,res)=>{
  // console.log("i am hitting");
    let userId= Number(req.params.user_id);
    if (isNaN(userId)) {
      // Handle the case where req.params.id is not a valid number
      // For example, you could send a 400 Bad Request response
      res.status(400).send('Invalid ID parameter');
      return;
    }
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = (page - 1) * limit;

    try {
        const count = await db.chat_logs.count({
          where:{
            user_id:userId
          }
        })
        const chat_logs = await db.chat_logs.findAll({
            where:{
                user_id:userId
            },
            limit: limit,
            offset: offset
        });
        if(!chat_logs){
            throw new Error("No chats found for this User ID");
        }
            res.status(200).json({
                statusCode: 200,
                responseCode: 'SUCCESS',
                message: `Successful fetched all the chats of User with id ${userId}`,
                data:chat_logs,
                pagination:{
                  totalItems: count,
                  totalpage:Math.ceil(count/limit),
                  currentPage: page,
                  nextPage: Math.min(page + 1, Math.ceil(count / limit)),
                  previousPage: Math.max(1, page - 1),
                  limit:limit
                }
            });
        
    } catch (error) {
      console.error(error);
        res.status(400).json({
            statusCode: 400,
            responseCode: 'ERROR',
            message: error.message || "no chat logs found" ,
        });
    }
}

module.exports = {
  addChat,getAllChatsByUser_id
};
