const express = require('express');
const router = express.Router();
const { addUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorizeRoles('admin', 'hod'), addUser)
  .get(protect, authorizeRoles('admin', 'hod', 'faculty'), getUsers);

router.route('/:id')
  .put(protect, authorizeRoles('admin', 'hod'), updateUser)
  .delete(protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
