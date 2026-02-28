import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Linkedin, Github, Globe,
  Save, X, Plus, Trash2, Award, Building, User, Link as LinkIcon,
  Loader2
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadProfilePicture, uploadCoverPhoto, type Experience, type Education, type UserProfile } from '../services/user.service';

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    currentRole: currentUser?.currentRole || '',
    company: currentUser?.company || '',
    batch: currentUser?.batch || '',
    department: currentUser?.department || '',
    location: {
      city: currentUser?.location?.city || '',
      state: currentUser?.location?.state || '',
      country: currentUser?.location?.country || '',
    },
    linkedinUrl: currentUser?.linkedinUrl || '',
    githubUrl: currentUser?.githubUrl || '',
    portfolioUrl: currentUser?.portfolioUrl || '',
    skills: currentUser?.skills || [],
    experience: currentUser?.experience || [],
    education: currentUser?.education || [],
    mentorshipAvailable: currentUser?.mentorshipAvailable || false,
  });

  const [newSkill, setNewSkill] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <User size={18} /> },
    { id: 'professional', label: 'Professional', icon: <Briefcase size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Award size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Building size={18} /> },
    { id: 'education', label: 'Education', icon: <Award size={18} /> },
    { id: 'social', label: 'Social Links', icon: <LinkIcon size={18} /> },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove),
    }));
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const handleUpdateExperience = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: Experience, i: number) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      grade: '',
      description: '',
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const handleUpdateEducation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu: Education, i: number) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setError('');
      const response = await uploadProfilePicture(file);

      if (response.success && response.data) {
        // Update user context
        if (updateUser && response.data.user) {
          updateUser(response.data.user);
        }
        setSuccess('Profile picture updated successfully!');
      }
    } catch (err: any) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.message || 'Error uploading profile picture');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploadingCover(true);
      setError('');
      const response = await uploadCoverPhoto(file);

      if (response.success && response.data) {
        // Update user context
        if (updateUser && response.data.user) {
          updateUser(response.data.user);
        }
        setSuccess('Cover photo updated successfully!');
      }
    } catch (err: any) {
      console.error('Error uploading cover photo:', err);
      setError(err.response?.data?.message || 'Error uploading cover photo');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Convert location object to string for backend
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        currentRole: formData.currentRole,
        company: formData.company,
        batch: formData.batch,
        department: formData.department,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
        mentorshipAvailable: formData.mentorshipAvailable,
        location: formData.location.city
          ? `${formData.location.city}${formData.location.state ? ', ' + formData.location.state : ''}${formData.location.country ? ', ' + formData.location.country : ''}`
          : '',
      } as unknown as Partial<UserProfile>;

      const response = await updateProfile(submitData);

      if (response.success && response.data) {
        // Update user context
        if (updateUser) {
          updateUser(response.data);
        }
        setSuccess('Profile updated successfully!');

        // Removed redirect to profile after saving so user can continue editing
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={0}
        unreadMessages={0}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Edit Profile</h1>
              <p className="text-neutral-600 mt-1">Update your profile information</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <X size={18} className="mr-2" />
              Cancel
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {success}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card variant="elevated" className="p-6 border border-neutral-100 flex-1">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Profile Picture</h2>
              <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <img
                    src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&size=128`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-medium"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <label htmlFor="profile-picture" className="cursor-pointer">
                    <div className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-block text-sm font-medium">
                      {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    </div>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                  <p className="text-xs text-neutral-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-6 border border-neutral-100 flex-1">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Cover Photo</h2>
              <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative w-full sm:w-32 h-20 sm:h-24 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                  {currentUser?.coverPhoto ? (
                    <img
                      src={currentUser.coverPhoto}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-100 to-primary-50 flex items-center justify-center">
                      <Globe size={24} className="text-primary-300" />
                    </div>
                  )}
                  {isUploadingCover && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <label htmlFor="cover-photo" className="cursor-pointer">
                    <div className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-block text-sm font-medium">
                      {isUploadingCover ? 'Uploading...' : 'Change Cover'}
                    </div>
                    <input
                      id="cover-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoChange}
                      className="hidden"
                      disabled={isUploadingCover}
                    />
                  </label>
                  <p className="text-xs text-neutral-500 mt-2">16:9 aspect ratio recommended. Max 5MB.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Section Navigation */}
          <div className="flex overflow-x-auto border-b border-neutral-200 mb-6">
            {sections.map((section: { id: string; label: string; icon: any }) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeSection === section.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                  }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Basic Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-4">
                      Location
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) => handleLocationChange('state', e.target.value)}
                        placeholder="State"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={formData.location.country}
                        onChange={(e) => handleLocationChange('country', e.target.value)}
                        placeholder="Country"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Professional Section */}
            {activeSection === 'professional' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Professional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={formData.currentRole}
                      onChange={(e) => handleInputChange('currentRole', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Google, Microsoft"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Batch
                      </label>
                      <input
                        type="text"
                        value={formData.batch}
                        onChange={(e) => handleInputChange('batch', e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 2020"
                      />
                    </div>

                    {currentUser?.role === 'student' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Civil Engineering"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mentorship"
                      checked={formData.mentorshipAvailable}
                      onChange={(e) => handleInputChange('mentorshipAvailable', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="mentorship" className="text-sm font-medium text-neutral-700">
                      Available for Mentorship
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Skills & Expertise</h2>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add a skill..."
                    />
                    <Button type="button" variant="primary" onClick={handleAddSkill}>
                      <Plus size={18} className="mr-2" />
                      Add
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.skills.map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full"
                        >
                          <span className="text-sm font-medium">{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">Work Experience</h2>
                  <Button type="button" variant="outline" onClick={handleAddExperience}>
                    <Plus size={18} className="mr-2" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-6">
                  {formData.experience.map((exp: any, index: number) => (
                    <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-neutral-900">Experience #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., Software Engineer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Company *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., Google"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => handleUpdateExperience(index, 'location', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., Bangalore, India"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Employment Type
                            </label>
                            <select
                              value={exp.type}
                              onChange={(e) => handleUpdateExperience(index, 'type', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Freelance">Freelance</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Start Date *
                            </label>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              End Date
                            </label>
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                              disabled={exp.currentlyWorking}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`currently-working-${index}`}
                            checked={exp.currentlyWorking}
                            onChange={(e) => handleUpdateExperience(index, 'currentlyWorking', e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <label htmlFor={`currently-working-${index}`} className="text-sm font-medium text-neutral-700">
                            I currently work here
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe your responsibilities and achievements..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.experience.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      No experience added yet. Click "Add Experience" to get started.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">Education</h2>
                  <Button type="button" variant="outline" onClick={handleAddEducation}>
                    <Plus size={18} className="mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-6">
                  {formData.education.map((edu: any, index: number) => (
                    <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-neutral-900">Education #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Degree *
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Bachelor of Technology"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Institution *
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., BIT Sindri"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleUpdateEducation(index, 'fieldOfStudy', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., Civil Engineering"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Start Year
                            </label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => handleUpdateEducation(index, 'startYear', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., 2016"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              End Year
                            </label>
                            <input
                              type="text"
                              value={edu.endYear}
                              onChange={(e) => handleUpdateEducation(index, 'endYear', e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., 2020"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Grade / CGPA
                          </label>
                          <input
                            type="text"
                            value={edu.grade}
                            onChange={(e) => handleUpdateEducation(index, 'grade', e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., 8.5 CGPA"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={edu.description}
                            onChange={(e) => handleUpdateEducation(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe your education, achievements, etc..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.education.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      No education added yet. Click "Add Education" to get started.
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
              <Card variant="elevated" className="p-6 mb-6 border border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Social Links</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Linkedin size={16} className="inline mr-2" />
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Github size={16} className="inline mr-2" />
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://github.com/your-username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Globe size={16} className="inline mr-2" />
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="bg-gradient-to-r from-primary-600 to-primary-500"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileEditPage;
