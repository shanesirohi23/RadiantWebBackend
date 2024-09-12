const jwt=require ('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config()

const genjwttoken=(userid,res)=>{
const token=jwt.sign({userid},process.env.JWT_SECRET, {expiresIn:'15d'});
res.cookie("jwt",token,{
    httpOnly: true, 
    maxAge: 15 * 24 * 60 * 60 * 1000,
} )
return token;
}

module.exports=genjwttoken;