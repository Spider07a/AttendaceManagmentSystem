const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

const addStudent = async (req, res) => {
  const { name, email, rollNo } = req.body;
  try {
    // Check constraints
    const studentExists = await User.findOne({ rollNo });
    if (studentExists) return res.status(400).json({ message: 'Student with this roll number already exists' });
    
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'User with this email already exists' });

    // Generate credentials
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt); // default password

    // Create user object strictly defining them as student
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'student',
      rollNo 
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    // Collect all students
    const students = await User.find({ role: 'student' }).select('-password');
    // Fetch widespread attendance records separately across collections
    const allAttendance = await Attendance.find({});

    // Map relationships for frontend consumption
    const mapped = students.map(s => {
      const sAttendance = allAttendance.filter(a => a.studentId.toString() === s._id.toString());
      return {
        id: s._id,
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
        attendance: sAttendance.map(a => ({ date: a.date, status: a.status }))
      };
    });

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, rollNo } = req.body;
  try {
    const student = await User.findOne({ _id: id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (rollNo && rollNo !== student.rollNo) {
      const existingRoll = await User.findOne({ rollNo });
      if (existingRoll) return res.status(400).json({ message: 'Roll number already in use' });
      student.rollNo = rollNo;
    }
    if (email && email !== student.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
      student.email = email;
    }
    if (name) student.name = name;

    const updatedUser = await student.save();
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rollNo: updatedUser.rollNo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await User.findOne({ _id: id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(id);
    await Attendance.deleteMany({ studentId: id }); // Cascade delete attendance

    res.status(200).json({ message: 'Student successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addStudent, getStudents, updateStudent, deleteStudent };
