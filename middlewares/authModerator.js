
const jwt =require('jsonwebtoken');
const StatusCode=require('../utils/StatusCode.json');
const ModeratorModel=require('../models/Moderator');
const authModerator=async(req,res,next)=>{
    try{
        const {token}=req.cookies; // extracting the token from the cookie which was set up during the login phase 
        if(!token)
        {
           return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                message:`${StatusCode.UNAUTHORIZED.status} Please Login First`
            })
        
        }
        const decoded=await jwt.verify(token,process.env.JWT_SECERT); // now we are decoding the token so that we get the id of the user who is logged in
        console.log(decoded);
        req.user=await ModeratorModel.findById(decoded._id); // we are setting the finding the details of the user by the decoded id so that we use the user details for pushing the likes comment and other details
        console.log(req.user);
        next();
    }
    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:`${e.message} ${StatusCode.INTERNAL_SERVER_ERROR.status} `  
        })
    }
}
module.exports=authModerator;