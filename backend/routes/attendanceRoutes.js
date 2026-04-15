const express = require('express');
const router = express.Router();
const { markAttendance, getSubjectAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/mark', protect, authorizeRoles('faculty'), markAttendance);
router.get('/subject/:subjectId', protect, authorizeRoles('admin', 'hod', 'faculty'), getSubjectAttendance);
router.get('/my', protect, authorizeRoles('student'), getMyAttendance);

module.exports = router;
