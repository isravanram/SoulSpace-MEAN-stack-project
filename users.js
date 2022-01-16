const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    fullname: {
        type:String,
        required:true
    },

    email: {
        type:String,
        required:true,
        unique:true
    },
   
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    age: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
})

// Creating collection for users

const User=new mongoose.model("User",userSchema)

module.exports=User