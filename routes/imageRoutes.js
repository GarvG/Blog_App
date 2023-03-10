const express=require('express');
const Router=express.Router();
const isAuth=require('../middlewares/auth');
const {createImage,LikeandislikeImage, deleteImage, getImage, UpdateImage, addComment}=require('../controllers/imageController');

Router.post('/upload',isAuth,createImage);
Router.get('/:id',isAuth,LikeandislikeImage).delete('/:id',isAuth,deleteImage);
Router.get('/all/:id',getImage);
Router.put('/update/:id',isAuth,UpdateImage);
Router.put('/comment/:id',isAuth,addComment);


module.exports=Router;