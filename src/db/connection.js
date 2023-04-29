const mongoose= require("mongoose")

const dataBaseConnect =async()=>{
    try{
        const conn=await mongoose.connect("mongodb+srv://gauravkmjaiswal:p72cbAPTY393Q9Ab@cluster0.ll9due1.mongodb.net/test")
        console.log("connection successful")
    }catch(error)
    {
        console.log(error)
    }
}
dataBaseConnect()

