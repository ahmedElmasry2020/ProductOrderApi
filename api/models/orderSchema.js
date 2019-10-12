const mongoose =require('mongoose');

const orderSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    quantity:{type:Number,required:true}
},
 {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports=mongoose.model('order',orderSchema);