const jwt=require("jsonwebtoken")
const { blacklist } = require("../blacklist")
require("dotenv").config()
const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
     if(blacklist.includes(token)){
      next()
}
    if(token){
        const decode=jwt.verify(token,process.env.secr)
        if(decode){
            req.body.userID=decode.userID
            next()
        }else{
            res.status(400).send({"msg":"Please login first"})
        }
    }else{
        res.status(400).send({"msg":"Please login first"})
    }
}
module.exports={auth}