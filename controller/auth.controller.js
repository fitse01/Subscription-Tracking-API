import mongoose from "mongoose";
import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
//what is a req body ? req.body is an object containing data from the client (POST request)

export const signUp = async (req, res , next) => {
    const session = await mongoose.startSession();
    session.startTransaction(); //session used here for atomic update (Atomic operation) database operation that update the state are atomic ,All or Nothing  , never get half operation . Insert or Update either works completely or it doesn't
    // reason why the operation doesn't work
    // 1 , one or more constraint violated
    // 2, datatype mismatch
    // 3, syntax error

    try {
        const { name,email, password } = req.body;
        // check if the user already exist
        const existingUser = await User.findOne({email});
        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name,email,password:hashedPassword}] , {session});

        const token = jwt.sign({userId:newUsers[0]._id} , JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});


        await  session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message:"User Created Successfully ",
            data:{
                token,
                user:newUsers[0],
            }
        })
    }catch (error) {
        await  session.abortTransaction(); // sth goose wrong abort the process entirely ,since half process storage is not allowed
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res , next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
    //     check if the user exist
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

    //     if user exist check password if right
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

    //     if user is found and has valid password to signin we should generate new token
        const token =  jwt.sign({userId:user._id} , JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        res.status(200).json({
            success: true,
            message:"User Signed In  Successfully ",
            data:{
                token,
                user:user
            }
        })
    }catch (error) {
        next(error);
    }
}

export const signOut = async (req, res , next) => {}






