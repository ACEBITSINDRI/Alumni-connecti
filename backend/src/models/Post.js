import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'authorModel', // Dynamic reference based on authorModel field
    },
    authorModel: {
      type: String,
      required: true,
      enum: ['Alumni', 'Student'], // Model names, not roles
    },
    authorRole: {
      type: String,
      enum: ['student', 'alumni'],
      required: true,
    },
    type: {
      type: String,
      enum: ['general', 'job', 'internship', 'advice', 'event', 'question', 'achievement'],
      default: 'general',
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    images: [{
      url: String,
      publicId: String, // Cloudinary public ID for deletion
    }],

    // Job-specific fields (for job and internship posts)
    jobDetails: {
      company: String,
      location: String,
      jobType: String, // Renamed from 'type' to avoid conflict
      salary: String,
      applyLink: String, // Renamed from 'applyUrl' to match frontend
      deadline: String, // Changed to String to match frontend format
    },

    // Engagement
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'likes.userModel', // Dynamic reference for likes
      },
      userModel: {
        type: String,
        enum: ['Alumni', 'Student'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'comments.userModel', // Dynamic reference for comments
      },
      userModel: {
        type: String,
        enum: ['Alumni', 'Student'],
      },
      content: {
        type: String,
        required: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          // No ref - just storing IDs
        },
      }],
      replies: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'comments.replies.userModel',
        },
        userModel: {
          type: String,
          enum: ['Alumni', 'Student'],
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, 'Reply cannot exceed 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    shares: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        // No ref - just storing IDs
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      // No ref - just storing IDs
    }],

    // Visibility and Status
    visibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'likes.user': 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function () {
  return this.shares.length;
});

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
