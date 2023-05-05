const userModel = require("../models/users-model");
const bcryptjs = require("bcryptjs");

const payloadCheck = function(req,res,next){
    try {
        const {username,password} = req.body;
        if(!username || !password){
            res.status(400).json({message:"username ve password gereklidir"});
        }else{
            next();
        }
    } catch (error) {
        next(error);
    }
}

const userNameCheck = async function(req,res,next){
   try {
    const {username} = req.body;
    const user =await userModel.getByFilter({username:username});
    if(user && user.id>0){
        res.status(401).json({message:"username alınmış"});
    }
    else{
        next()
    }
   } catch (error) {
    next(error);
   }
}

const loginPasswordCheck = async function(req,res,next){
    try {
        const {username,password} = req.body;
        const user = await userModel.getByFilter({username:username});
        if(!user){
            res.status(404).json({message:"böyle bir user yok"});
        }else{
            let isPasswordValid = bcryptjs.compareSync(password,user.password);
            if(!isPasswordValid){
                res.status(400).json({message:"geçersiz kriterler"});
            }else{
                next();
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {loginPasswordCheck,userNameCheck,payloadCheck}