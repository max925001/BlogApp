import {Router} from 'express'
import { login, logout, register, updateUser } from '../controllers/userController.js'
import { isLoggedIn } from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRoute = Router()


userRoute.post('/register' ,register)
userRoute.post('/login',login)
userRoute.post('/logout',logout)
userRoute.post('/editprofile',isLoggedIn,upload.single('avatar'),updateUser)



export default userRoute