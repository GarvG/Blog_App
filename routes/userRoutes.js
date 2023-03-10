const express=require('express');
const Router=express.Router();
const {register,login, logout, updatePassword, updateProfile}=require('../controllers/userController');
const isAuth = require('../middlewares/auth');

Router.post('/registers',register);
Router.post('/login',login);
Router.get('/logout',logout);
Router.put('/update',isAuth,updatePassword)
Router.put('/update/profile',isAuth,updateProfile);


module.exports=Router;