const express = require('express');
const router = express.Router();
const { addStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, addStudent).get(protect, admin, getStudents);
router.route('/:id').put(protect, admin, updateStudent).delete(protect, admin, deleteStudent);

module.exports = router;
