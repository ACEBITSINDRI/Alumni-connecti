import api from './api';

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  type?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
  description?: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profilePicture?: string;
  coverPhoto?: string;
  batch?: string;
  company?: string;
  currentRole?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  mentorshipAvailable?: boolean;
  mentorshipDomains?: string[];
  connections?: string[];
  isConnected?: boolean;
  hasPendingRequest?: boolean;
}

export interface UserStats {
  connectionsCount: number;
  postsCount: number;
  savedPostsCount: number;
  eventsCount: number;
}

export interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  currentRole?: string;
  company?: string;
  batch?: string;
  department?: string;
  location?: string;
  role: 'student' | 'alumni' | 'admin';
}

export interface SuggestedConnection extends Connection {
  mutualConnections?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Get all users with filters
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: 'student' | 'alumni';
  batch?: string;
  company?: string;
  location?: string;
  department?: string;
  skills?: string;
  search?: string;
}): Promise<ApiResponse<{ users: UserProfile[]; pagination: any }>> => {
  try {
    const response = await api.get('/api/users', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get all users error:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (query: string, role?: 'student' | 'alumni', limit?: number): Promise<ApiResponse<UserProfile[]>> => {
  try {
    const response = await api.get('/api/users/search', {
      params: { query, role, limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file: File): Promise<ApiResponse<{ profilePicture: string; user: UserProfile }>> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.put('/api/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Upload profile picture error:', error);
    throw error;
  }
};

// Upload cover photo
export const uploadCoverPhoto = async (file: File): Promise<ApiResponse<{ coverPhoto: string; user: UserProfile }>> => {
  try {
    const formData = new FormData();
    formData.append('coverPhoto', file);

    const response = await api.put('/api/users/cover-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Upload cover photo error:', error);
    throw error;
  }
};

// Get connections
export const getConnections = async (): Promise<ApiResponse<Connection[]>> => {
  try {
    const response = await api.get('/api/users/connections');
    return response.data;
  } catch (error: any) {
    console.error('Get connections error:', error);
    throw error;
  }
};

// Get suggested connections
export const getSuggestedConnections = async (limit?: number): Promise<ApiResponse<SuggestedConnection[]>> => {
  try {
    const response = await api.get('/api/users/suggestions', {
      params: { limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Get suggested connections error:', error);
    throw error;
  }
};

// Get user stats
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  try {
    const response = await api.get('/api/users/stats');
    return response.data;
  } catch (error: any) {
    console.error('Get user stats error:', error);
    throw error;
  }
};
