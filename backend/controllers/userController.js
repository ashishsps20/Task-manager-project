import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_EXPPIRES = '24h';

const createToken = (userId) => jwt.sign(
  { userId },
  JWT_SECRET,
  { expiresIn: TOKEN_EXPPIRES }
);  

// REGISTER FUNCTION
export async function registerUser(req,res){
    const { name, email, password } = req.body;

    if( !name || !email || !password ) {
        return res.status(400).json({ success : false , message: "Please fill all fields" });
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({ success : false , message: "Please enter a valid email" });
    }
    if(password.length < 8) {
        return res.status(400).json({ success : false , message: "Password must be at least 8 characters" });
    }

    try{
      if(await User.findOne({ email })) {
          return res.status(409).json({ success : false , message: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      const token = createToken(user._id);

      res.status(201).json({
        success: true,token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }});
    }

    catch(error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


// LOGIN FUNCTION
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}  


// GET USER FUNCTION
// export async function getUser(req, res) { 
//     try {
//         const user = await User.findById(req.user.id).select('-name email');
//         if(!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         res.json({ success: true,user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }
export async function getUser(req, res) {
  try {
    // ── FIXED HERE: simply return the already‑loaded req.user (no extra DB find)
    return res.json({ success: true, user: req.user });
  } catch (error) {
    console.error('Error in getUser:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
}

// UPDATE USER FUNCTION
export async function updateUser(req, res) {
  const { name,email} = req.body;

  if(!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }

  try{
    const exists = await User.findOne({ email,_id: { $ne: req.user.id } }); 

    if(exists) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true ,runValidators: true ,select: 'name email' });

    res.json({ success: true, user });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// CHNAGE PASSWORD FUNCTION
export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields and ensure password is at least 8 characters"
    });
  }

  try {
    const user = await User.findById(req.user.id).select('password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.password = await bcrypt.hash(newPassword, 10);  // assign the new hash
    await user.save();                                    // persist it

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

