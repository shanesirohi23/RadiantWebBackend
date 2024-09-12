const User = require("../Models/userModel");
const jwt=require ('jsonwebtoken');


    const isAuthenticated = async (req, res, next) => {
    try {  
        let token = req.cookies.jwt;
        console.log(token)
      if (!token) {
        return res.status(400).json({ message: "unauthorized" });
      }
      let decodedUser = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedUser) {
        return res.status(400).json({ message: "unauthorized" });
      }
      let user = await User.findById(decodedUser.userid).select("-password");
      req.user = user;
      console.log(req.user)
      next();
} catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in isAuthenticated middleware: ", error.message);
}
    }
module.exports=isAuthenticated