import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const cookieOptions = {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    // sameSite:'None',
    // secure: true

}
export const register = async (req,res) =>{

const {username,password} = req.body


if(!username || !password){

  return res.status(400).json({ success:false,message:"All fields are required"})


}

const userExist = await User.findOne({username})

if(userExist){
    return res.status(400).json({success:false,message:"Username already exist"})
}

const user = await User.create({

    username,
    password,
    avatar:{
        public_id: username,
        secure_url:''
    }

})

await user.save();
user.password = undefined;

const token = await user.generateJWTtoken()
res.cookie('token' ,token ,cookieOptions)


res.status(200).json({
    success: true,
    message:'User registered successfully',
    user,
})

}


export const login = async (req,res) =>{

const {username,password} =req.body

try {

    if(!username || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const user =  await User.findOne({username}).select("+password")
   


    if (!user) {
    return res.status(400).json({
        success:false,
        message:"Invalid username or password"
    })}

const isPasswordMatch = await user.comparePassword(password)

  if (!isPasswordMatch) {
    return res.status(400).json({
        success:false,
        message:"Invalid username or password"
    })
  }
user.password=undefined
  const token = await user.generateJWTtoken()
  res.cookie('token' ,token ,cookieOptions)
  res.status(200).json({
    success:true,
    message:"User logged in successfully",
    user
  })
  
    
} catch (error) {
    console.error(error)
    
}

} 


 export const logout = (req,res) =>{

res.cookie('token' ,null ,{
    secure:true,
    maxAge:0,
    httpOnly:true
})

res.status(200).json({
    success:true,
    message:'User Logout Successfully'

})

}

export const updateUser = async (req ,res ,next) =>{
console.log("hello")
const {id} = req.user
console.log(id)
const user = await User.findById(id)

if(!user){
return res.status(400).json({
    success:false ,
    message:"User not found"
})


}


const userProfile = req.file

if(!userProfile){
    return res.status(400).json({
        success:false ,
        message:"Please upload a profile picture"
    })
}

try {
    if(userProfile){

const result = await uploadOnCloudinary(userProfile)
if(!result){
    return res.status(400).json({
        success:false ,
        message:"Failed to upload image"
    })
}

    user.avatar.public_id = result.public_id
    user.avatar.secure_url =result.secure_url
    
await user.save()
res.status(200).json({
    success:true,
    message:'Proifile photo changes successfully',
    user
})

}
} catch (error) {
    console.log(error)
    
}

}


 export const getUserData = async (req,res) =>{

    const {id} = req.user

    const user = User.findById(id)
    if(!user){
        return res.status(404).json({
            success:false ,
            message:"User not found"
        })

    }

    return res.status(200).json({
        success:true ,
        user
    })
}