const mongoose= require("mongoose")
const transactionSchema= new mongoose.Schema({
    trnxHash:{
        type:String,
        required:true,
    },
})
const Trnx=new mongoose.model("trnx",transactionSchema)
module.exports= Trnx;
