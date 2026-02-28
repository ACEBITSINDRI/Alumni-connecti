import api, { apiFormData } from './api';

export interface Comment {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: 'student' | 'alumni' | 'admin';
  };
  content: string;
  createdAt: string;
  likes?: { user: string }[];
  replies?: CommentReply[];
}

export interface CommentReply {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: 'student' | 'alumni' | 'admin';
  };
  content: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: 'student' | 'alumni' | 'admin';
    currentRole?: string;
    company?: string;
    batch?: string;
  };
  type: 'general' | 'job' | 'internship' | 'advice' | 'event' | 'question';
  title: string;
  content: string;
  images?: string[];
  jobDetails?: {
    company: string;
    location: string;
    type: string;
    salary?: string;
    applyLink?: string;
    deadline?: string;
  };
  likes: string[];
  comments: Comment[];
  savedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  type: string;
  title: string;
  content: string;
  images?: File[];
  jobDetails?: {
    company?: string;
    location?: string;
    jobType?: string;
    salary?: string;
    applyLink?: string;
    deadline?: string;
  };
}

export interface PostResponse {
  success: boolean;
  message: string;
  data?: Post;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data?: {
    posts: Post[];
    total: number;
    page: number;
    pages: number;
  };
}

// Create a new post
export const createPost = async (postData: CreatePostData): Promise<PostResponse> => {
  const formData = new FormData();

  formData.append('type', postData.type);
  formData.append('title', postData.title);
  formData.append('content', postData.content);

  // Append images
  if (postData.images && postData.images.length > 0) {
    postData.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  // Append job details if present
  if (postData.jobDetails) {
    formData.append('jobDetails', JSON.stringify(postData.jobDetails));
  }

  const response = await apiFormData.post<PostResponse>('/api/posts', formData);
  return response.data;
};

// Get all posts
export const getPosts = async (page: number = 1, limit: number = 10, filter?: string): Promise<PostsResponse> => {
  const params: any = { page, limit };
  if (filter && filter !== 'all') {
    params.type = filter;
  }

  const response = await api.get<PostsResponse>('/api/posts', { params });
  return response.data;
};

// Get a single post by ID
export const getPostById = async (postId: string): Promise<PostResponse> => {
  const response = await api.get<PostResponse>(`/api/posts/${postId}`);
  return response.data;
};

// Like a post
export const likePost = async (postId: string): Promise<PostResponse> => {
  const response = await api.post<PostResponse>(`/api/posts/${postId}/like`);
  return response.data;
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<PostResponse> => {
  const response = await api.delete<PostResponse>(`/api/posts/${postId}/like`);
  return response.data;
};

// Add a comment to a post
export const addComment = async (postId: string, content: string): Promise<PostResponse> => {
  const response = await api.post<PostResponse>(`/api/posts/${postId}/comment`, { content });
  return response.data;
};

// Add a reply to a comment
export const replyToComment = async (postId: string, commentId: string, content: string): Promise<PostResponse> => {
  const response = await api.post<PostResponse>(`/api/posts/${postId}/comments/${commentId}/reply`, { content });
  return response.data;
};

// Like a comment
export const likeComment = async (postId: string, commentId: string): Promise<PostResponse> => {
  const response = await api.post<PostResponse>(`/api/posts/${postId}/comments/${commentId}/like`);
  return response.data;
};

// Delete a comment
export const deleteComment = async (postId: string, commentId: string): Promise<PostResponse> => {
  const response = await api.delete<PostResponse>(`/api/posts/${postId}/comments/${commentId}`);
  return response.data;
};

// Delete a post
export const deletePost = async (postId: string): Promise<PostResponse> => {
  const response = await api.delete<PostResponse>(`/api/posts/${postId}`);
  return response.data;
};

// Save a post
export const savePost = async (postId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/api/posts/${postId}/save`);
  return response.data;
};

// Unsave a post
export const unsavePost = async (postId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/api/posts/${postId}/save`);
  return response.data;
};
