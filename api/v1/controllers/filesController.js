const db = require("../models/index");

const { FileUpload }= require("../utils/uploadFiles");

const uploadFile = async(req,res)=>{
    console.log(req.files.files.length>0);
    try {
        if(req.files.files.length>0){
            const files = [];
            for (const file of req.files.files) {
              const result = await FileUpload(file, "uploads/files/");
              files.push(result);
            }
    
            console.log(files);
            const uploads = await db.files.bulkCreate([...files]);
    
            if(uploads){
                res.status(201).json({message:"Files uploaded successfully", data:uploads}); 
            }else{
                throw new Error('Error while saving files to the database');
            }

        }else{
            const file = await FileUpload(req.files.files, "uploads/files/") ;

            const upload = await db.files.create(file);
            if(upload){
                res.status(201).json({message:"File uploaded successfully", data:upload}); 
            }else{
                throw new Error('Error while saving file to the database');
            }

        }
    } catch (error) {
        res.status(400).json({
            message: error.message || error
        })
    }
}






module.exports = {
    uploadFile
}