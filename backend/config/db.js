import { config } from "dotenv";
import mongoose from "mongoose";
config()
mongoose.set('strictQuery' ,false)


const connectToDb = async () =>{
    try{
 const {connection}= await mongoose.connect(process.env.MONGO_URI)

if(connection){
    console.log(`MongoDb connected succesfully ${connection.host}`)
}

    }catch(e){

        console.log(e)
        process.exit(1)
    }


}

export default connectToDb