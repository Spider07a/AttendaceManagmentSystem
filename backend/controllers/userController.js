const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

const addUser = async (req, res) => {
  const { name, email, role, department, semester, rollNo } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'User with this email already exists' });

    if (rollNo) {
        const rollExists = await User.findOne({ rollNo });
        if (rollExists) return res.status(400).json({ message: 'Roll number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt); // default password

    const user = await User.create({ 
      name, email, password: hashedPassword, role, department, semester, rollNo 
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Admin sees all. HOD sees only their department.
    let query = {};
    if (req.user.role === 'hod') {
        query.department = req.user.department;
    }
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department, semester, rollNo } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }
    if (name) user.name = name;
    if (role) user.role = role;
    if (department) user.department = department;
    if (semester) user.semester = semester;
    // ... rollNo updates ...

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await Attendance.deleteMany({ studentId: id });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };
