const express=require('express');
const { register, login, viewAllpost, blockUser, addComment } = require('../controllers/moderatorController');
const authModerator = require('../middlewares/authModerator');
const Router=express.Router();

Router.post('/register',register);
Router.post('/login',login);
Router.get('/all',authModerator,viewAllpost);
Router.get('/block/:id',blockUser);
Router.put('/comment/:id',authModerator,addComment);

module.exports=Router;