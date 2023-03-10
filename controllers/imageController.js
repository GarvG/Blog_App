const ImageModel=require('../models/Images');
const StatusCode=require('../utils/StatusCode.json');
const UserModel=require('../models/Users');


const createImage=async(req,res)=>{
try{

    console.log("letsch"+" "+req.user)
    if(req.user.Blocked==true)
    {
       return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!'
        })
    }
    const newImagedata={
        caption:req.body.caption,
        Image:req.body.Image,
        owner:req.user._id,
    }
    console.log(newImagedata);

    const Imagedata=await ImageModel.create(newImagedata);  // Creating a new Image
    const user=await UserModel.findById(req.user._id); // Finiding the user 
    user.posts.push(Imagedata._id);   // in the User object there is a post feild push the image id there
    await user.save(); // saving the post

    res.status(StatusCode.CREATED.statusCode).json({
        success:true,
        Imagedata,
        message:StatusCode.CREATED.status
    })
}
catch(e){
res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
    success:false,
    message:e.message  
})
}
}

const deleteImage= async(req,res)=>{
    try{
        const Image= await ImageModel.findById(req.params.id);
        if(req.user.Blocked==true)
        {
           return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                success:false,
                message:'User Blocked!'
            })
        }
        if(!Image)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            }) 
        }
        if(Image.owner.toString() !== req.user._id.toString())
        {
            return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                message:StatusCode.UNAUTHORIZED.status
            })
        }
        
        await Image.deleteOne();
        const user=await UserModel.findById(req.user._id);
        const indexofImageDelete=user.posts.indexOf(req.params.id);
        user.posts.splice(indexofImageDelete,1);
        await user.save();

        res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:'Post Deleted'
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

const LikeandislikeImage=async(req,res)=>{
    try{
    const Imagedata =await ImageModel.findById(req.params.id);
    if(req.user.Blocked==true)
    {
       return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
            success:false,
            message:'User Blocked!'
        })
    }
        if(!Imagedata)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            })
        }

    if(Imagedata.likes.includes(req.user._id))
    {
        const index=Imagedata.likes.indexOf(req.user._id);
        Imagedata.likes.splice(index,1);
        await Imagedata.save();
        return res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"Image Unliked"
        })
    }
    else
    {
        Imagedata.likes.push(req.user._id);
        await Imagedata.save();
        return res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"Image liked"
        })
    }
    }
    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:`${e.message} ${StatusCode.INTERNAL_SERVER_ERROR.status} `  
        })
    }
}

const getImage=async(req,res)=>{
    try{
        let image=await ImageModel.findById(req.params.id);
        if(!image)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            })
        }
        res.status(StatusCode.OK.statusCode).json({success:StatusCode.OK.status,
            message:image.Image});
    }
    catch(e)
    {
        res.status(StatusCode.INTERNAL_SERVER_ERROR.statusCode).json({
            success:false,
            message:`${e.message} ${StatusCode.INTERNAL_SERVER_ERROR.status} `  
        }) 
    }
}
const UpdateImage=async(req,res)=>{
    try{
        //console.log(req.params.id)
        if(req.user.Blocked==true)
        {
           return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                success:false,
                message:'User Blocked!'
            })
        }
        const oldImage=await ImageModel.findById(req.params.id);

        if(!oldImage)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            }) 
        }
        if(oldImage.owner.toString() !== req.user._id.toString())
        {
            return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                message:StatusCode.UNAUTHORIZED.status
            })
        }
        console.log(oldImage);
        oldImage.caption=req.body.caption;
        oldImage.Image=req.body.Image;
       
        await oldImage.save();
        console.log(req.body);
        // res.send("updated")
        res.status(StatusCode.ACCEPTED.statusCode).json({
            success:StatusCode.ACCEPTED.status,
            oldImage,
            message: "Updated the Image"
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
const addComment=async(req,res)=>{
    try{
        if(req.user.Blocked==true)
        {
           return res.status(StatusCode.UNAUTHORIZED.statusCode).json({
                success:false,
                message:'User Blocked!'
            })
        }
        const Image=await ImageModel.findById(req.params.id);
        if(!Image)
        {
            return res.status(StatusCode.NOT_FOUND.statusCode).json({
                message:StatusCode.NOT_FOUND.status 
            })

        }
    
    let commentIndex=-1;
    Image.comments.forEach((item,idx)=>{
        if(item.user.toString()===req.user._id.toString())
        {
            commentIndex=idx;
        }
    })
    if(commentIndex!== -1)
    {
        Image.comments[commentIndex].comment=req.body.comment;
        await Image.save();
        return res.status(StatusCode.OK.statusCode).json({
            success:StatusCode.OK.status,
            message:"comment updated"
        })
    }
    else
    {
        Image.comments.push({
            user:req.user._id,
            comment:req.body.comment,
        })
    }
    await Image.save();
     res.status(StatusCode.OK.statusCode).json({
        success:StatusCode.OK.status,
        message:"comment added"
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

module.exports={createImage,LikeandislikeImage,deleteImage,getImage,UpdateImage,addComment}