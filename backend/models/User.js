const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'hod', 'faculty', 'student'], default: 'student' },
  department: { type: String },
  semester: { type: Number },
  rollNo: { type: String } // Applies primarily for students
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
