const mongoose= require("mongoose")
const validator= require("validator")
const bcrypt=require("bcryptjs")
const jwt= require("jsonwebtoken")
const userSchema= new mongoose.Schema({
    enrollmentNumber:{
        type:Number,
        // required:true,
    },
    password:{
        type:String,
        // required:true
    },
    studentType:{
        type:String,
        // required:true
    },
    privateKey:{
        type:String,
        // required:true
    },
    address:{
        type:String,
        // required:true
    },
    amount:{
        type:Number,
        // required:true
    },
    totalBuy:{
        type:Number,
        // required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],


})
userSchema.methods.generateAuthToken= async function()
{
    try {
        const token=jwt.sign({_id:this._id.toString()},"process.env.SECRET_KEY")
        console.log(token)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        console.log("why")
        return token;
    } catch (error) {
        res.send("error in function for token")
    }
}

userSchema.pre("save",async function(next){
    try{
        if(this.isModified("password"))
        {
            this.password= await bcrypt.hash(this.password,10)
        }
        next()
    }catch(error)
    {
        console.log("Pre Error "+ error)
    }
    
})
const User=new mongoose.model("user",userSchema)
module.exports= User;
