const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorizeRoles('admin', 'hod'), createSubject)
  .get(protect, getSubjects); // Anyone logged in can view subjects filtering applies internally

module.exports = router;
