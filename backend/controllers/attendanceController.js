const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  const { date, subjectId, records } = req.body;
  const facultyId = req.user._id;

  try {
    for (const [studentId, status] of Object.entries(records)) {
      await Attendance.findOneAndUpdate(
        { studentId, subjectId, date },
        { studentId, subjectId, facultyId, date, status },
        { upsert: true, new: true }
      );
    }
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectAttendance = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const attendance = await Attendance.find({ subjectId }).populate('studentId', 'name rollNo email');
        res.json(attendance);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyAttendance = async (req, res) => {
  try {
    const attendanceLogs = await Attendance.find({ studentId: req.user._id }).populate('subjectId', 'name code');
    res.status(200).json(attendanceLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { markAttendance, getSubjectAttendance, getMyAttendance };
