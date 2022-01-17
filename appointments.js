const mongoose=require("mongoose")
// const Register = require("./models/register");
// const User = require("./models/users");
const appointmentSchema = new mongoose.Schema({
   
    userEmail: {
        type:String,
        unique:true
    },

    counsellorEmail: {
        type:String,
        unique:true
    },

    bookingTime: {
        type:Date,
        default:Date.now,
    }
})

// Now we need to create a collection

const Appointment = new mongoose.model("Appointment",appointmentSchema);

module.exports=Appointment;