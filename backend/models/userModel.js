import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

const userModel = new mongoose.Schema({

     username: { type: String,
         required: true, 
         unique: true },

  password: { type: String,
     required: true ,
     select: false ,
    
    },

  avatar:{ 
    public_id:{
        type:String
    },
    secure_url:{
        type:String
    }
},
  created_at: { type: Date, 
    default: Date.now },
},{
    timestamps:true
})


userModel.pre('save', async function(next){
 if(!this.isModified('password')){
        return next()
    }
    this.password =  await bcrypt.hash(this.password,10)
})

userModel.methods ={
    generateJWTtoken:  async function(){
        return await Jwt.sign(
            {
                id: this._id ,username:this.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    }
,
comparePassword: async function(plaintextPassword){

    return  await bcrypt.compare(plaintextPassword,this.password)
},
}

const User = mongoose.model('User',userModel)
export default User;