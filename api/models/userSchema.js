const mongoose =require('mongoose');

const userSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    token:String
//    poductImage:{type :String}
},
 {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports=mongoose.model('user',userSchema);