const express=require('express');
const morgan =require('morgan');
const bodyParser =require('body-parser');
const mongoose =require('mongoose');
const app =express();
const products =require('./api/Routes/Produts/product');
const orders =require('./api/Routes/Orders/orders');
const user =require("./api/Routes/user/user");

const url ='mongodb://127.0.0.1:27017/shop';
mongoose.connect(url,
    { useNewUrlParser: true }
)
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})
db.on('error', err => {
  console.error('connection error:', err)
})
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-with,Content-Type,Accept,Authorization");
    if(req.meth ==="OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})
app.use('/products',products);
app.use('/orders',orders);
app.use("/user",user);
app.use((req,res,next)=>{
    const err=new Error('Not Found');
    err.status=404;
    next(err);
})
app.use((error,req,res,next)=>{
    res.status(error.ststus ||500);
    res.json({
        message:error.message
    })
})
module.exports =app;