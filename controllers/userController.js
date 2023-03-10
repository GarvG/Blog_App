const express=require('express');
const UserModel=require('../models/Users');
const bcrypt=require('bcrypt');
const options=require('../utils/options');
const StatusCode=require('../utils/StatusCode.json');


const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        let User= await UserModel.findOne({email});
        if(User)
        {
            res.status(StatusCode.BAD_REQUEST.statusCode).json({
                success:false,
                message:`${StatusCode.BAD_REQUEST.status} User already Exists`
            });
        }
       
       let user;
        user=await UserModel.create({
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
    let user=await UserModel.findOne({email}).select('+password');
    console.log(user);

    if(user.Blocked==true)
    {
       return  res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!'
        })
    }
    if(!user)
    {
      return  res.status(StatusCode.NOT_FOUND.statusCode).json({
            success:false,
            message:`${StatusCode.NOT_FOUND.status} Please Register first`
        })
    }
    const matched= await user.matchPassword(password);
   

    if(!matched)
    {
      return  res.status(StatusCode.BAD_REQUEST.statusCode).json({
            success:false,
            message:`${StatusCode.BAD_REQUEST.status} Incorrect Password`
        })
    }

    
 // After registering when  the user try to login then we are generating the token with the payload as the id given by the mongooose 
    const token=await user.generateToken();
    res.status(StatusCode.OK.statusCode).cookie('token',token,options).json({
        success:true,
        user,
        message:"Login Scucess"
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

const logout=(req,res)=>{
    try{
        res.status(StatusCode.OK.statusCode).cookie('token',null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:StatusCode.OK.status,
            message:"Logout"
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
const updatePassword=async (req,res)=>{
    try{
        const user=await UserModel.findById(req.user._id).select("+password");
        if(user.Blocked==true)
    {
       return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!'
        })
    }
        const {oldpassword,newpassword}=req.body;
        const isMatch=await user.matchPassword(oldpassword);
        if(!isMatch)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                success:StatusCode.NOT_FOUND.status,
                message:"Incorrect Old Password"
            })
        }
        user.password=newpassword;
        user.save();
        res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"Password Changed"
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

const updateProfile=async (req,res)=>{
    try{
        const user=await UserModel.findById(req.user._id);
        if(user.Blocked==true)
    {
       return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!'
        })
    }
        const {name,email}=req.body;
        if(name)
        {
            user.name=name;
        }
        if(email)
        {
            user.email=email;
        }
        await user.save();
        res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"Update Profile"
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
module.exports={register,login,logout,updatePassword,updateProfile};