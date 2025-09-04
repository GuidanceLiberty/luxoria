import mongoose from "mongoose";

const connectToDb = async() => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGO_URI);
        if(connect){
            console.log("Established connection to database!");
        }
    } catch (error) {
        console.log("Error occurred connecting to DB " + error);
        process.exit(1);
    }
} 

export default connectToDb;