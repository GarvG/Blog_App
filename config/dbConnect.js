const mongoose=require('mongoose');
const Connection=()=>{
    mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('DB CONECTED!'))
    .catch(err => console.log(err));
}


module.exports=Connection;