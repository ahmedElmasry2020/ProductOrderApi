const mongoose =require('mongoose');

const productSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Name:{type:String,required:true},
    Price:{type:Number,required:true},
    poductImage:{type :String}
},
 {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports=mongoose.model('product',productSchema);