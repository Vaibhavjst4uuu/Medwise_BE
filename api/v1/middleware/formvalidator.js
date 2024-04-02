
const checkreqBody = async(req,res,next)=>{
    // console.log(req.body);
    if(Object.keys(req.body).length === 0){
        return res.status(400).json({
            statusCode:404,
            responseCode: "ERR_MISSING_PARAMETERS",
            message:"Request Body is missing"
        });
    }

    next();
}


const checkreqParams = async(req,res,next)=>{
    console.log(req.params);

    if(req.params.id == ":id"){
        return res.status(400).json({
            statusCode:404,
            responseCode: "ERR_MISSING_PARAMETERS",
            message:"Request params is missing"
        });
    }
    next();
}




module.exports = {checkreqBody, checkreqParams};