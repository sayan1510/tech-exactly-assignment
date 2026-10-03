const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (first user becomes admin for testing simplicity, or just default user)
    // Here we'll just allow creating default user. Admin can be set in DB manually or via a secret route.
    const user = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: generateToken(user._id, user.role) 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Compare passwords
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        token: generateToken(user._id, user.role) 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
