import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  type User,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'alumni' | 'admin';
  batch?: string;
  enrollmentNumber?: string;
  phone?: string;
  department?: string;
  currentRole?: string;
  company?: string;
  location?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  mentorshipAvailable?: boolean;
  mentorshipDomains?: string[];
}

/**
 * Register new user with Firebase Auth + MongoDB
 */
export const registerUser = async (data: RegisterData, profilePicture?: File, idCard?: File) => {
  try {
    // 1. Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // 2. Update Firebase profile
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // 3. Send email verification
    await sendEmailVerification(user);

    // 4. Get Firebase ID token
    const idToken = await user.getIdToken();

    // 5. Create user profile in MongoDB via backend
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('role', data.role);
    formData.append('firebaseUid', user.uid);

    if (data.batch) formData.append('batch', data.batch);
    if (data.enrollmentNumber) formData.append('enrollmentNumber', data.enrollmentNumber);
    if (data.phone) formData.append('phone', data.phone);
    if (data.department) formData.append('department', data.department);
    if (data.currentRole) formData.append('currentRole', data.currentRole);
    if (data.company) formData.append('company', data.company);
    if (data.location) formData.append('location', data.location);
    if (data.bio) formData.append('bio', data.bio);
    if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
    if (data.githubUrl) formData.append('githubUrl', data.githubUrl);
    if (data.portfolioUrl) formData.append('portfolioUrl', data.portfolioUrl);

    if (data.skills && data.skills.length > 0) {
      formData.append('skills', JSON.stringify(data.skills));
    }

    if (data.mentorshipAvailable !== undefined) {
      formData.append('mentorshipAvailable', data.mentorshipAvailable.toString());
    }

    if (data.mentorshipDomains && data.mentorshipDomains.length > 0) {
      formData.append('mentorshipDomains', JSON.stringify(data.mentorshipDomains));
    }

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    if (idCard) {
      formData.append('idCard', idCard);
    }

    const response = await axios.post(`${API_URL}/api/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${idToken}`,
      },
    });

    return {
      user: response.data.data.user,
      firebaseUser: user,
      message: response.data.message,
    };
  } catch (error: any) {
    // If MongoDB creation fails, delete Firebase user
    if (auth.currentUser) {
      await auth.currentUser.delete();
    }
    throw error;
  }
};

/**
 * Login user with Firebase Auth
 */
export const loginUser = async (email: string, password: string, role: 'student' | 'alumni') => {
  try {
    // 1. Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Get Firebase ID token
    const idToken = await user.getIdToken();

    // 3. Verify with backend and get user profile from MongoDB
    const response = await axios.post(`${API_URL}/api/auth/login`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return {
      user: response.data.data.user,
      firebaseUser: user,
      idToken,
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Login with Google
 */
export const loginWithGoogle = async (role: 'student' | 'alumni') => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Get Firebase ID token
    const idToken = await user.getIdToken();

    // Check if user exists in MongoDB, if not create profile
    const response = await axios.post(`${API_URL}/api/auth/google-login`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return {
      user: response.data.data.user,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      firebaseUser: user,
      idToken,
      isNewUser: response.data.data.isNewUser,
      needsProfileCompletion: response.data.data.needsProfileCompletion,
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Login with LinkedIn
 */
export const loginWithLinkedIn = async (role: 'student' | 'alumni') => {
  try {
    // Use backend LinkedIn OAuth endpoint
    const linkedinAuthUrl = `${API_URL}/api/auth/linkedin?role=${role}`;

    // Open LinkedIn OAuth in a new window
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const linkedinWindow = window.open(
      linkedinAuthUrl,
      'LinkedIn',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!linkedinWindow) {
      throw new Error('Failed to open LinkedIn login window. Please allow popups for this site.');
    }

    // Wait for the window to close and check if authentication was successful
    return new Promise((resolve, reject) => {
      const checkWindow = setInterval(() => {
        if (linkedinWindow.closed) {
          clearInterval(checkWindow);

          // Check if user was authenticated by checking localStorage
          const accessToken = localStorage.getItem('accessToken');
          const user = localStorage.getItem('user');

          if (accessToken && user) {
            resolve({
              user: JSON.parse(user),
              accessToken,
              refreshToken: localStorage.getItem('refreshToken'),
              isNewUser: localStorage.getItem('isNewUser') === 'true',
              needsProfileCompletion: localStorage.getItem('needsProfileCompletion') === 'true',
            });
          } else {
            reject(new Error('LinkedIn authentication failed or was cancelled.'));
          }
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkWindow);
        if (!linkedinWindow.closed) {
          linkedinWindow.close();
        }
        reject(new Error('LinkedIn authentication timed out.'));
      }, 5 * 60 * 1000);
    });
  } catch (error: any) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user is currently signed in');
  }

  // Re-authenticate user
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Update password
  await firebaseUpdatePassword(user, newPassword);
};

/**
 * Get current Firebase user
 */
export const getCurrentFirebaseUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get Firebase ID token
 */
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};
