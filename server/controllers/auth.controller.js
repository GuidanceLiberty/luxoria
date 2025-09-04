import { User } from "../models/User.js";
import { loginSchema, registerSchema } from "../schemas/Index.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { ObjectId } from 'mongodb';


export const register = async(req, res) => {
    const { name, email, password, phone, photo } = req.body;
    //return console.log("Form : ", req.body);

    const { error } = registerSchema.validate({ name, email, password, phone });
    if(error){
        return res.status(400).json({
            success: false, message: error.details[0].message
        });
    }

    
    try {
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({success: false, message: "Provided email already taken!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name, email, password: hashedPassword, phone, photo
        });

        await user.save();

        //JWT
        generateTokenAndSetCookie(res, user._id);

        res.status(201).json({
            success: true, message: "Account was created successfully", 
            data: { ...user._doc, password: undefined }
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  // validate input
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(401).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials provided!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // generate JWT + set cookie
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login was successful",
      user: {
        ...user._doc,
        password: undefined,
        token, // include token if your frontend needs it
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: `Error : ${error.message}`,
    });
  }
};



export const getUsers = async(req, res) => {
    try {
        const users = await User.find().sort({createdAt : 'desc'});
        if(!users){
            return res.status(400).json({
                success: false, message: "No user record found!"
            });
        }

        res.status(200).json({
            success: true, message: "Users record(s) found", data: users
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}


export const updateUserRole = async (req, res) => {
    let { _id, role } = req.body;   //return console.log("FORM : ", req.body)

    _id = new ObjectId(_id);
    if(!_id){
        return res.status(400).json({
            success: false, message: "User ID required"
        });
    }


    try {

        const user = await User.findOneAndUpdate({ _id }, { 
             role
             }, { new: true });

        if(!user){
            return res.status(400).json({
                success: false, message: `Failed to update ${user?.name} role`
            });
        }     

        res.status(200).json({
            success: true, message: `${user?.name} User role updated successfully`, data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: "Error occurred : " + error.message
        });
    }
}