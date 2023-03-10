const express=require('express');
const app=express();
require('dotenv').config();
const PORT=process.env.PORT;
const Connection=require('./config/dbConnect');
Connection();
const cookieParser=require('cookie-parser');
const UserRouter=require('./routes/userRoutes');
const ImageRouter=require('./routes/imageRoutes');
const moderatorRouter=require('./routes/moderatoerRoutes');
app.use(express.json());

app.use(cookieParser());

app.use('/user',UserRouter);
app.use('/Image',ImageRouter);
app.use('/moderator',moderatorRouter);


app.listen(PORT,(()=>{
    console.log(`Server Listening in on ${PORT}`)
}))