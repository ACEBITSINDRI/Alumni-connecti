import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleLogin,
  linkedInLogin,
  linkedInAuth,
  linkedInCallback,
  getMe,
  logout,
  updateFCMToken,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getProfileStatus,
  markProfileModalAsSeen,
} from '../controllers/authController.js';
import { protect, verifyFirebaseToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { firebaseUpload } from '../middleware/firebaseUpload.js';

const router = express.Router();

// Validation rules (updated for Firebase)
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
  // Password not required for Firebase auth (handled on client side)
];

const loginValidation = [
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
  // Firebase ID token will be verified in middleware
];

const googleLoginValidation = [
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
];

const linkedInLoginValidation = [
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
];

const fcmTokenValidation = [
  body('fcmToken').trim().notEmpty().withMessage('FCM token is required'),
];

const emailValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Routes (Firebase-based)
router.post('/register', firebaseUpload, registerValidation, validate, register);
router.post('/login', protect, loginValidation, validate, login);
router.post('/google-login', verifyFirebaseToken, googleLoginValidation, validate, googleLogin);
router.post('/linkedin-login', verifyFirebaseToken, linkedInLoginValidation, validate, linkedInLogin);

// LinkedIn OAuth Routes (Custom Flow)
router.get('/linkedin', linkedInAuth);
router.get('/linkedin/callback', linkedInCallback);

router.get('/me', protect, getMe);
router.get('/profile-status', protect, getProfileStatus);
router.patch('/mark-modal-seen', protect, markProfileModalAsSeen);
router.post('/logout', protect, logout);
router.post('/fcm-token', protect, fcmTokenValidation, validate, updateFCMToken);

// Email Verification Routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', emailValidation, validate, resendVerificationEmail);

// Password Reset Routes (for email/password users)
router.post('/forgot-password', emailValidation, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, validate, resetPassword);

export default router;
