import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, HardHat, Building2, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DEPARTMENT_INFO } from '../../utils/civilEngConstants';
import { login as loginApi } from '../../services/auth.service';
import { loginWithGoogle } from '../../services/firebase/auth.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SEOHead from '../../components/common/SEOHead';

// Import images
import alumniConnectLogo from '../../assets/logos/alumni_connect_logo-removebg-preview.png';
import bigBuildingGreenish from '../../assets/civil eng element/big building greenish.png';
import multiFamousBuilding from '../../assets/civil eng element/multi famous building.jpeg';
import bridgesWithNames from '../../assets/civil eng element/bridges with names.jpeg';

interface LoginPageProps {
  userType?: 'student' | 'alumni';
}

const LoginPage: React.FC<LoginPageProps> = ({ userType = 'student' }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'alumni'>(userType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginApi(formData.email, formData.password, activeTab);

      if (response.success && response.data) {
        // Set user in context
        setUser(response.data.user);

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setErrors({ submit: response.message || 'Login failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Google Sign-In with Firebase
      const result = await loginWithGoogle(activeTab);

      if (result.user) {
        // CRITICAL: Save tokens explicitly
        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('user', JSON.stringify(result.user));
          console.log('[Login Google] Tokens saved:', {
            hasAccessToken: !!localStorage.getItem('accessToken'),
            hasUser: !!localStorage.getItem('user'),
          });
        } else {
          console.error('[Login Google] No tokens in response!', result);
        }

        // Set user in context
        setUser(result.user);

        // Small delay to ensure localStorage write completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Show success message and navigate
        if (result.isNewUser && result.needsProfileCompletion) {
          toast.success('Account created successfully!');
          toast('Please complete your profile to continue', { icon: 'ℹ️' });
          navigate('/profile/edit');
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);

      // Handle specific Firebase errors
      let errorMessage = 'Failed to sign in with Google. Please try again.';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Redirect to backend LinkedIn OAuth endpoint
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const linkedInAuthUrl = `${API_URL}/api/auth/linkedin?role=${activeTab}`;

      // Redirect to backend OAuth flow
      window.location.href = linkedInAuthUrl;
    } catch (error: any) {
      console.error('LinkedIn login error:', error);
      toast.error('Failed to initiate LinkedIn sign-in');
      setErrors({ submit: 'Failed to initiate LinkedIn sign-in' });
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Login - BIT Sindri Civil Engineering Alumni Network | ACE BIT Sindri"
        description="Login to Alumni Connect - Official portal for BIT Sindri Civil Engineering alumni and students. Access mentorship programs, job opportunities, events, and connect with  Civil Engineering professionals."
        keywords="BIT Sindri login, Civil Engineering alumni login, BIT Dhanbad login, ACE BIT Sindri portal, Alumni network login, Student portal BIT Sindri"
        url="https://alumni-connect.bitsindri.ac.in/login"
      />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Side - Hero Section with Civil Engineering Theme */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Images */}
          <div className="absolute inset-0">
            <div className="absolute inset-0">
              <img
                src={bigBuildingGreenish}
                alt="Civil Engineering Building"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-orange-700/90 to-blue-900/90"></div>
            </div>

            {/* Decorative image overlays */}
            <div className="absolute top-20 right-10 w-48 h-48 rounded-lg overflow-hidden opacity-20 rotate-6">
              <img
                src={bridgesWithNames}
                alt="Famous Bridges"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-20 left-10 w-56 h-56 rounded-lg overflow-hidden opacity-15 -rotate-6">
              <img
                src={multiFamousBuilding}
                alt="Famous Buildings"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Logo and Institution */}
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center">
                <img
                  src={alumniConnectLogo}
                  alt="Alumni Connect Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Alumni Connect</h1>
                <p className="text-orange-100 text-base font-semibold">ACE • BIT Sindri</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Badge variant="success" className="mb-4 bg-yellow-400 text-orange-900">
                <Building2 size={16} className="mr-2" />
                Est. {DEPARTMENT_INFO.established}
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-3">
                {DEPARTMENT_INFO.name}
              </h2>
              <p className="text-orange-50 leading-relaxed text-sm">
                {DEPARTMENT_INFO.description}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
            {[
              { icon: <CheckCircle />, text: '0+ Alumni Network' },
              { icon: <CheckCircle />, text: 'Top Infrastructure Companies' },
              { icon: <CheckCircle />, text: 'Expert Mentorship' },
              { icon: <CheckCircle />, text: 'Exclusive Job Opportunities' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-white">
                {React.cloneElement(feature.icon, { size: 20, className: 'text-yellow-400 flex-shrink-0' })}
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative z-10 text-center text-orange-100 text-sm">
            <p>© {new Date().getFullYear()} ACE BIT Sindri. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center justify-center mb-8">
              <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-xl p-4 mb-3">
                <img
                  src={alumniConnectLogo}
                  alt="Alumni Connect Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Alumni Connect</h1>
              <p className="text-sm text-orange-600 font-semibold">ACE BIT Sindri</p>
            </div>

            <Card variant="elevated" className="p-8 shadow-xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Tabs */}
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab('student')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'student'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <GraduationCap size={18} />
                  <span>Student</span>
                </button>
                <button
                  onClick={() => setActiveTab('alumni')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'alumni'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <HardHat size={18} />
                  <span>Alumni</span>
                </button>
              </div>

              {/* Social Sign-In Buttons */}
              <div className="mb-6 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLinkedInSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#0A66C2] border-2 border-[#0A66C2] rounded-lg hover:bg-[#004182] hover:border-[#004182] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-white">
                    {isLoading ? 'Signing in...' : 'Continue with LinkedIn'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
                    placeholder="your.email@example.com"
                    error={errors.email}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    placeholder="Enter your password"
                    error={errors.password}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to={`/signup/${activeTab}`}
                  className="font-medium text-orange-600 hover:text-orange-700"
                >
                  Create Account
                </Link>
              </p>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <a href="/terms-of-service" className="text-orange-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy-policy" className="text-orange-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
