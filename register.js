const mongoose=require("mongoose")
// const autoIncrement= require("mongoose-auto-increment");


const counselorSchema = new mongoose.Schema({
   
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
    qualifications: {
        type:String,
        required:true
    },
    aadhaarnumber:{
        type:Number,
        required:true
    } ,
    category:
    {
        type:String,
        required:true
    },
    availability:
    {
        type:Boolean,
        default:false,
        required:false
    }
})

// Now we need to create a collection

const Register = new mongoose.model("Counselors",counselorSchema);

module.exports=Register;