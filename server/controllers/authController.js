import JWT from 'jsonwebtoken'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success:true,message: 'No token provided' });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({success:false, message: 'Access denied, admin role required' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({success:false, message: 'Invalid token' });
  }
};


const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success:false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({success:true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Server error' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({success:false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success:false, message: 'Invalid credentials' });
    }

    const token = JWT.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({success:true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Server error' });
  }
};

export {
    isAdmin,
    register,
    login
}