import mongoose from 'mongoose';
import {DB_URI,NODE_ENV} from "../config/env.js";

if(!DB_URI){
    throw new Error("Please define MONGODB_URI environment variable inside .env<development/production>.local");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database ${NODE_ENV} MODE `);
    }
    catch (error) {
        console.error("Error connecting to Database", error);
        process.exit(1)
    }
}
export default connectToDatabase;