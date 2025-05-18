import jwt from 'jsonwebtoken'


 export const isLoggedIn = async (req,res,next) =>{

const {token} = req.cookies 


 if(!token){
       
        return res.status(400).json({
            success:false,
            message:"Please login first"
        })
    }
     const userDetails = await jwt.verify(token,process.env.JWT_SECRET)
     req.user = userDetails;
   next();


}