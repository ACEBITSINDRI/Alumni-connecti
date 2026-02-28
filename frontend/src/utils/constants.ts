// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ACE Website
export const ACE_WEBSITE_URL = import.meta.env.VITE_ACE_WEBSITE_URL || 'https://acebits.in';

// Razorpay
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ALUMNI: 'alumni',
} as const;

// Post Types
export const POST_TYPES = {
  GENERAL: 'general',
  JOB: 'job',
  INTERNSHIP: 'internship',
  ADVICE: 'advice',
  EVENT: 'event',
  QUESTION: 'question',
} as const;

// Job Types
export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
} as const;

// Event Types
export const EVENT_TYPES = {
  WORKSHOP: 'workshop',
  SEMINAR: 'seminar',
  WEBINAR: 'webinar',
  MEETUP: 'meetup',
  CONFERENCE: 'conference',
  SOCIAL: 'social',
} as const;

// Event Modes
export const EVENT_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_IMAGES_PER_POST: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

// Pagination
export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  ALUMNI_PER_PAGE: 20,
  OPPORTUNITIES_PER_PAGE: 15,
  EVENTS_PER_PAGE: 12,
  COMMENTS_PER_PAGE: 10,
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMENT_REPLY: 'comment_reply',
  COMMENT_LIKE: 'comment_like',
  NEW_FOLLOWER: 'new_follower',
  NEW_POST: 'new_post',
  JOB_OPPORTUNITY: 'job_opportunity',
  EVENT_REMINDER: 'event_reminder',
  PROFILE_VIEW: 'profile_view',
  MENTORSHIP_REQUEST: 'mentorship_request',
  DONATION_ACKNOWLEDGMENT: 'donation_acknowledgment',
  SYSTEM: 'system',
} as const;

// Privacy Settings
export const PRIVACY_OPTIONS = {
  PUBLIC: 'public',
  MEMBERS_ONLY: 'members_only',
  CONNECTIONS_ONLY: 'connections_only',
  PRIVATE: 'private',
} as const;

// Donation Tiers
export const DONATION_TIERS = {
  BRONZE: { min: 500, max: 2000, name: 'Bronze' },
  SILVER: { min: 2000, max: 5000, name: 'Silver' },
  GOLD: { min: 5000, max: 10000, name: 'Gold' },
  PLATINUM: { min: 10000, max: Infinity, name: 'Platinum' },
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  LINKEDIN: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
} as const;

// Character Limits
export const CHAR_LIMITS = {
  POST_TITLE: 200,
  BIO_STUDENT: 200,
  BIO_ALUMNI: 500,
  COMMENT: 1000,
  POST_TAGS: 5,
  SKILLS: 20,
  DONATION_MESSAGE: 200,
} as const;
