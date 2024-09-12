const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const userSchema= new Schema ({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    pfp:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    followers:{
        type:[String],
        default:[]
    },
    following:{
        type:[String],
        default:[]
    },
})
userSchema.set('timestamps', true);
const User = new mongoose.model('User', userSchema)

module.exports=User;