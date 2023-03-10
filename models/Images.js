const mongoose=require('mongoose');

const Images=mongoose.Schema({
caption:String,

Image:{
    // public_id:String,
    // url:String
    type:String,
},

owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
},
createdAt:{
type:Date,
default:Date.now,
},
likes:[
    {
        
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        
    },
],

comments:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        },
        moderator:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Moderator'
        },
        comment:{
            type:String,
            required:true,
        }
    }
]
})

const Image=mongoose.model('Image',Images);

module.exports=Image;

