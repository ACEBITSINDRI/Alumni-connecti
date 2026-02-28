import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import { uploadProfilePicture, uploadCoverPhotoImage } from '../config/cloudinary.js';

// @desc    Get all users with pagination and filters
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      batches,
      companies,
      locations,
      domains, // domains maps to department
      role,
      batch,
      company,
      location,
      department,
      skills,
      search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    const andConditions = [];

    // Search by name or email
    if (search) {
      andConditions.push({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { currentRole: { $regex: search, $options: 'i' } },
        ]
      });
    }

    // Handle Batches
    if (batches) {
      const batchList = batches.split(',').map(b => b.trim());
      andConditions.push({ batch: { $in: batchList } });
    } else if (batch) {
      andConditions.push({ batch: batch });
    }

    // Handle Companies
    if (companies) {
      const companyList = companies.split(',').map(c => c.trim());
      const companyQueries = companyList.map(c => ({ company: { $regex: c, $options: 'i' } }));
      andConditions.push({ $or: companyQueries });
    } else if (company) {
      andConditions.push({ company: { $regex: company, $options: 'i' } });
    }

    // Handle Locations
    if (locations) {
      const locationList = locations.split(',').map(l => l.trim());
      const locationQueries = locationList.map(l => ({ location: { $regex: l, $options: 'i' } }));
      andConditions.push({ $or: locationQueries });
    } else if (location) {
      andConditions.push({ location: { $regex: location, $options: 'i' } });
    }

    // Handle Departments/Domains
    if (domains) {
      const domainList = domains.split(',').map(d => d.trim());
      andConditions.push({ department: { $in: domainList } });
    } else if (department) {
      andConditions.push({ department: department });
    }

    // Handle Skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      andConditions.push({ skills: { $in: skillsArray } });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    let users = [];
    let total = 0;

    // If role filter specified, query only that collection
    if (role === 'alumni') {
      users = await AlumniModel.find(query)
        .select('-password -emailVerificationToken -passwordResetToken -connectionRequests')
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip)
        .lean();
      total = await AlumniModel.countDocuments(query);
    } else if (role === 'student') {
      users = await StudentModel.find(query)
        .select('-password -emailVerificationToken -passwordResetToken -connectionRequests')
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip)
        .lean();
      total = await StudentModel.countDocuments(query);
    } else {
      // Get both alumni and students
      const [alumni, students] = await Promise.all([
        AlumniModel.find(query)
          .select('-password -emailVerificationToken -passwordResetToken -connectionRequests')
          .sort({ createdAt: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean(),
        StudentModel.find(query)
          .select('-password -emailVerificationToken -passwordResetToken -connectionRequests')
          .sort({ createdAt: -1 })
          .limit(limitNum)
          .skip(skip)
          .lean(),
      ]);

      users = [...alumni, ...students].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      users = users.slice(0, limitNum);

      const [alumniCount, studentCount] = await Promise.all([
        AlumniModel.countDocuments(query),
        StudentModel.countDocuments(query),
      ]);
      total = alumniCount + studentCount;
    }

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalUsers: total,
          hasMore: pageNum * limitNum < total,
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { query, role, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const limitNum = parseInt(limit);

    // Build search query
    const searchQuery = {
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { currentRole: { $regex: query, $options: 'i' } },
        { skills: { $regex: query, $options: 'i' } },
      ],
    };

    let users = [];

    if (role === 'alumni') {
      users = await AlumniModel.find(searchQuery)
        .select('firstName lastName email profilePicture currentRole company batch location role')
        .limit(limitNum)
        .lean();
    } else if (role === 'student') {
      users = await StudentModel.find(searchQuery)
        .select('firstName lastName email profilePicture batch department role')
        .limit(limitNum)
        .lean();
    } else {
      const [alumni, students] = await Promise.all([
        AlumniModel.find(searchQuery)
          .select('firstName lastName email profilePicture currentRole company batch location role')
          .limit(limitNum)
          .lean(),
        StudentModel.find(searchQuery)
          .select('firstName lastName email profilePicture batch department role')
          .limit(limitNum)
          .lean(),
      ]);
      users = [...alumni, ...students].slice(0, limitNum);
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users',
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in alumni collection first
    let user = await AlumniModel.findById(id)
      .select('-password -emailVerificationToken -passwordResetToken -connectionRequests');

    // If not found, try student collection
    if (!user) {
      user = await StudentModel.findById(id)
        .select('-password -emailVerificationToken -passwordResetToken -connectionRequests');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user data with default values for connection status
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        isConnected: false,
        hasPendingRequest: false,
      },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const UserModel = getUserModel(req.user.role);

    // Fields that can be updated
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'bio',
      'currentRole',
      'company',
      'location',
      'yearsOfExperience',
      'skills',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'mentorshipAvailable',
      'mentorshipDomains',
      'department',
      'batch',
      'education',
      'coverPhoto',
    ];

    // Filter only allowed fields from request body
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle experience array
    if (req.body.experience) {
      updates.experience = req.body.experience;
    }

    // Handle education array
    if (req.body.education) {
      updates.education = req.body.education;
    }

    // Validate yearsOfExperience if provided
    if (updates.yearsOfExperience !== undefined) {
      const yearsNum = Number(updates.yearsOfExperience);
      if (isNaN(yearsNum) || yearsNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Years of experience must be a valid non-negative number',
        });
      }
      updates.yearsOfExperience = yearsNum;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    console.error('Full error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', '),
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Upload profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
export const uploadProfilePictureHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a profile picture',
      });
    }

    const result = await uploadProfilePicture(req.file.buffer, req.user._id.toString());

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.url },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken');

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: result.url,
        user,
      },
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
    });
  }
};

// @desc    Upload cover photo
// @route   PUT /api/users/cover-photo
// @access  Private
export const uploadCoverPhotoHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a cover photo',
      });
    }

    // We use the dedicated uploadCoverPhotoImage which does not enforce face detection
    const result = await uploadCoverPhotoImage(req.file.buffer, req.user._id.toString());

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { coverPhoto: result.url },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken');

    res.status(200).json({
      success: true,
      message: 'Cover photo uploaded successfully',
      data: {
        coverPhoto: result.url,
        user,
      },
    });
  } catch (error) {
    console.error('Upload cover photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading cover photo',
    });
  }
};

// @desc    Get user's connections
// @route   GET /api/users/connections
// @access  Private
export const getConnections = async (req, res) => {
  try {
    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id).populate(
      'connections',
      'firstName lastName email profilePicture currentRole company batch department location role'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.connections,
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching connections',
    });
  }
};

// @desc    Get suggested connections
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestedConnections = async (req, res) => {
  try {
    // Validate req.user exists
    if (!req.user || !req.user._id || !req.user.role) {
      console.error('Missing user data in getSuggestedConnections:', { user: req.user });
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User data missing.',
      });
    }

    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const UserModel = getUserModel(req.user.role);
    const currentUser = await UserModel.findById(req.user._id).select('connections batch department');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get IDs of already connected users, safeguard against empty connections
    const connections = currentUser.connections || [];
    const connectedIds = connections.map(id => id.toString());
    connectedIds.push(req.user._id.toString()); // Exclude self

    // Build suggestion query based on role
    let suggestions = [];

    if (req.user.role === 'student') {
      // For students, suggest alumni from same batch/department
      suggestions = await AlumniModel.find({
        _id: { $nin: connectedIds },
        $or: [
          { batch: currentUser.batch },
          { department: currentUser.department },
        ],
      })
        .select('firstName lastName email profilePicture currentRole company batch location role')
        .limit(limitNum)
        .lean();
    } else {
      // For alumni, suggest both alumni and students from same batch/department
      const [alumniSuggestions, studentSuggestions] = await Promise.all([
        AlumniModel.find({
          _id: { $nin: connectedIds },
          $or: [
            { batch: currentUser.batch },
            { department: currentUser.department },
          ],
        })
          .select('firstName lastName email profilePicture currentRole company batch location role')
          .limit(Math.ceil(limitNum / 2))
          .lean(),
        StudentModel.find({
          _id: { $nin: connectedIds },
          $or: [
            { batch: currentUser.batch },
            { department: currentUser.department },
          ],
        })
          .select('firstName lastName email profilePicture batch department role')
          .limit(Math.ceil(limitNum / 2))
          .lean(),
      ]);

      suggestions = [...alumniSuggestions, ...studentSuggestions].slice(0, limitNum);
    }

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Get suggested connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggested connections',
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    // Validate req.user exists
    if (!req.user || !req.user._id || !req.user.role) {
      console.error('Missing user data in getUserStats:', { user: req.user });
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User data missing.',
      });
    }

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id).select('connections savedPosts');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let postsCount = 0;
    try {
      import('mongoose').then(async (mongoose) => {
        const Post = mongoose.model('Post');
        postsCount = await Post.countDocuments({ author: req.user._id });
      }).catch(e => {
        console.error('Failed to get post model in stats:', e);
      })
    } catch (err) {
      console.error('Fallback Post import failed:', err);
    }

    // Count saved posts
    const savedPostsCount = user.savedPosts ? user.savedPosts.length : 0;

    const stats = {
      connectionsCount: user.connections ? user.connections.length : 0,
      postsCount: postsCount,
      savedPostsCount: savedPostsCount,
      eventsCount: 0, // TODO: Implement when events feature is ready
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
    });
  }
};
