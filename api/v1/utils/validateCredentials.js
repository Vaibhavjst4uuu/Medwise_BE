let responseFormate = {
    status: 400,
    message: "invalid data",
    error: [],
    data: [],
  };
  
  const validate = (e) => {
    // console.log(e.errors);
    responseFormate.error = [];
    responseFormate.data = [];
    if (e.errors) {
      e.errors.forEach((error) => {
        // if(error.validatorKey === "is_null"){
        //   responseFormate.error.push({
        //     field: error.path,
        //     messege: error.message,
        //   });
        // }
        // if (error.validatorKey === "isEmail") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     messege: error.message,
        //   });
        // }
  
        // if (error.validatorKey === "notEmpty") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     message: error.message,
        //   });
        // }
  
        // if (error.validatorKey === "not_valid") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     message: error.message,
        //   });
        // }
        // if (error.validatorKey === "not_valid_password") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     message: error.message,
        //   });
        // }
        // if (error.validatorKey === "not_unique") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     message: error.message,
        //   });
        // }
        // if (error.validatorKey === "isIn") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     messege: error.message,
        //   });
        // }
        
        // if (error.validatorKey === "len") {
        //   responseFormate.error.push({
        //     field: error.path,
        //     messege: error.message,
        //   });
        // }
        switch (error.validatorKey) {
          case "is_null":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "isEmail":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "notEmpty":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "not_valid":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "not_valid_password":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "not_unique":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "isIn":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          case "len":
            responseFormate.error.push({
              field: error.path,
              message: error.message,
            });
            break;
          default:
            responseFormate.error.push({
              field:"unknown",
              message:"An unknown error has occurred.",
            })
            break;
        }
        
      });
    }
    return responseFormate;
  };
  
  const validateAddress = (e) =>{
    responseFormate.error = [];
    responseFormate.data = [];

    if(e.errors){
      e.errors.forEach((error) =>{
        if(error.validatorKey === "is_null"){
          responseFormate.error.push({
            field: error.path,
            messege: error.message,
          });
        }

        if(error.validatorKey === "len"){
          responseFormate.error.push({
            field: error.path,
            messege: error.message,
          });
        }

        if (error.validatorKey === "notEmpty") {
          responseFormate.error.push({
            field: error.path,
            message: error.message,
          });
        }
        
        if(error.validatorKey === "isIn"){
          responseFormate.error.push({
            field: error.path,
            messege: error.message,
          });
        }
      })

    }
    return responseFormate;
  }
  module.exports = {
    validate,validateAddress
  };
  