import {config} from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectToDb from './config/db.js';
import userRoute from './routes/userRoutes.js';
import blogRoute from './routes/blogRoutes.js.js';
config()


const app = express();
const PORT = process.env.PORT || 5001;



connectToDb()
app.use(express.json()) //use for paras
app.use(express.urlencoded({
    extended:true
}))


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cookie'],

}))

app.use(cookieParser())

app.use(morgan('dev'))
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/ping' ,(req,res) =>{
    res.send('/pong')
})




app.use('/api/v1/user',userRoute)
app.use('/api/v1/blog',blogRoute)





// app.all('*' ,(req,res) =>{
//     res.status(404).send('OPPS!! 404 page not found')
// })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app