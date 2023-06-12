const express=require("express")
const postRouter=express.Router()
const {PostModel}=require("../models/post.model")
const jwt=require("jsonwebtoken")
require("dotenv").config


postRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization
    const decode=jwt.verify(token,process.env.secr)
    try {
        if(decode){
            const post=await PostModel.find({userID:decode.userID})
            res.status(200).send(post)
        }
        
    } catch (error) {
        res.status(400).send({msg:error.message})
    }

})


postRouter.post("/add",async(req,res)=>{
    try {
        const post =new PostModel(req.body)
        await post.save()
        res.status(200).send("Post have been added")
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

postRouter.patch("/update/:id",async(req,res)=>{
    let ID=req.params.id
    let payload=req.body
    let data =await PostModel.findOne({_id:ID})
    let userID_post=data.userID
    let userID_req=req.body.userID
    try {
        if((userID_post==userID_req)){
            await PostModel.findByIdAndUpdate({
                _id:ID
            },payload)
            res.send(`data with ${ID} is updated`)
        }else{
            res.send("Not authorized")
        }
        
    } catch (error) {
        res.send(error)
    }
})


postRouter.delete("/delete/:id",async(req,res)=>{
    let ID=req.params.id
    let payload=req.body
    let data =await PostModel.findOne({_id:ID})
    let userID_post=data.userID
    let userID_req=req.body.userID
    try {
        if((userID_post==userID_req)){
            await PostModel.findByIdAndDelete({
                _id:ID
            },payload)
            res.send(`data with ${ID} is deleted`)
        }else{
            res.send("Not authorized")
        }
        
    } catch (error) {
        res.send(error)
    }
})

postRouter.get("/post/top",async(req,res)=>{

  //logic
  try {
    const posttop=await PostModel.find().sort({no_of_comments:+1}).limit(3)
res.status(200).json({msg:"top 3 comments",data:posttop})
  } catch (error) {
res.status(500).json({error:error.message})
    
  }




})



module.exports={postRouter}