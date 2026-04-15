const Subject = require('../models/Subject');
const User = require('../models/User');

const createSubject = async (req, res) => {
  const { name, code, department, semester, facultyId } = req.body;
  try {
    const existing = await Subject.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Subject code already exists' });

    const subject = await Subject.create({ name, code, department, semester, facultyId });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'hod') {
        query.department = req.user.department;
    } else if (req.user.role === 'faculty') {
        query.facultyId = req.user._id;
    } else if (req.user.role === 'student') {
        query.department = req.user.department;
        query.semester = req.user.semester;
    }
    const subjects = await Subject.find(query).populate('facultyId', 'name email');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSubject, getSubjects };
