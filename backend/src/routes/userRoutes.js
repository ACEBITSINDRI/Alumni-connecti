import express from 'express';
import {
  getAllUsers,
  searchUsers,
  getUserById,
  updateProfile,
  uploadProfilePictureHandler,
  uploadCoverPhotoHandler,
  getConnections,
  getSuggestedConnections,
  getUserStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { firebaseUpload } from '../middleware/firebaseUpload.js';

const router = express.Router();

// Public generic routes
router.get('/', getAllUsers);
router.get('/search', searchUsers);

// Protected specific routes
router.get('/connections', protect, getConnections);
router.get('/suggestions', protect, getSuggestedConnections);
router.get('/stats', protect, getUserStats);

// Profile update routes (Protected)
router.put('/profile', protect, updateProfile);
router.put('/profile-picture', protect, firebaseUpload, uploadProfilePictureHandler);
router.put('/cover-photo', protect, firebaseUpload, uploadCoverPhotoHandler);

// Public dynamic route (MUST be placed last to avoid shadowing /stats, /suggestions, /connections, etc.)
router.get('/:id', getUserById);

export default router;
