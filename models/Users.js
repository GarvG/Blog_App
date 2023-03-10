const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const UserSchmea=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter a Name"],
    },
    email:{
        type:String,
        required:[true,"Please Enter a Email"],
        unique:[true,"Email already Exists"],
    },
    password:{
        type:String,
        required:[true,"Please Enter a password"],
        minlength:[6,'Password must be at least 6 length'],
        select : false,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Image'
        }
    ],
    Blocked:{
        type:Boolean,
        default:false,
    }
    

})

UserSchmea.pre('save',async function(next){  // before saving the user to DB using the mongoose hook we are hashing the password and then saving 
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
   

})
UserSchmea.methods.matchPassword=async function (password)
{
    console.log(password,this.password);
    return await bcrypt.compare(password,this.password);
}

UserSchmea.methods.generateToken= function(){
   return jwt.sign({_id:this._id},process.env.JWT_SECERT);
};

const User=mongoose.model('User',UserSchmea);
module.exports=User;