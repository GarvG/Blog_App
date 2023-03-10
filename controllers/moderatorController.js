const express=require('express');
const ModeratorModel=require('../models/Moderator');
const StatusCode=require('../utils/StatusCode.json');
const ImageModel=require('../models/Images');
const UserModel=require('../models/Users');
const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        let User= await ModeratorModel.findOne({email});
        if(User)
        {
            return res.status(StatusCode.BAD_REQUEST.statusCode).json({
                success:false,
                message:`${StatusCode.BAD_REQUEST.status} User already Exists`
            });
        }
  
       let user;
        user=await ModeratorModel.create({
            name,
            email,
            password
        });
        res.status(StatusCode.CREATED.statusCode).json({
            success:true,
            user,
            message:StatusCode.CREATED.status
        })
    }

    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:e.message + StatusCode.INTERNAL_SERVER_ERROR.status 
        })
    }
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
    let moderator=await ModeratorModel.findOne({email})
   
    if(!moderator)
    {
      return  res.status(StatusCode.NOT_FOUND.statusCode).json({
            success:false,
            message:`${StatusCode.NOT_FOUND.status} Please Register first`
        })
    }
    const matched= await moderator.matchPassword(password);
   

    if(!matched)
    {
      return  res.status(StatusCode.BAD_REQUEST.statusCode).json({
            success:false,
            message:`${StatusCode.BAD_REQUEST.status} Incorrect Password`
        })
    }

    
 // After registering when  the user try to login then we are generating the token with the payload as the id given by the mongooose 
    const token=await moderator.generateToken();
    res.status(StatusCode.OK.statusCode).cookie('token',token,{expires:new Date(Date.now()+90*24*60*60*100),
        httpOnly:true,
        }).json({
        success:true,
        moderator,
        message:"Login Scucess"
    })
    console.log(token);
    }
    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:e.message + StatusCode.INTERNAL_SERVER_ERROR.status 
        })
    }
    
}


const viewAllpost=async(req,res)=>{
    try{
        const Image=await ImageModel.find();
        res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"All post",
            Image
        })

    }
    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:`${e.message} ${StatusCode.INTERNAL_SERVER_ERROR.status} `  
        })

    }
}

const blockUser=async(req,res)=>{
    const userid=req.params.id;


   const details =await UserModel.findById(req.params.id);
    console.log(details);
    if(details.Blocked==false)
    {
        details.Blocked=true
        await details.save();
        res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!',
            details
        })
    }
    else
    {
        details.Blocked=false;
        await details.save();
        res.status(StatusCode.OK.statusCode).json({
            success:true,
            message:'User Unblocked',
            details
        })
        
    }
    
   
}

const addComment=async(req,res)=>{
    try{
      
        const Image=await ImageModel.findById(req.params.id);
        console.log(Image);
        console.log(req.params.id);
        if(!Image)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            })

        }
        Image.comments.push({
                    moderator:req.user._id,
                    comment:req.body.comment,
                })
       
        await Image.save();

    res.status(StatusCode.OK.statusCode).json({
        success:StatusCode.OK.status,
        message:"comment added",
        Image
    })

    }

    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:`${e.message} ${StatusCode.INTERNAL_SERVER_ERROR.status} `  
        })
    }
}
module.exports={register,login,viewAllpost,blockUser,addComment};