import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreVertical, Briefcase, MapPin, IndianRupee, Send, X, Copy, Check } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { likePost, unlikePost, addComment, savePost, unsavePost, replyToComment, likeComment } from '../../services/post.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface PostAuthor {
  id: string;
  name: string;
  role: string;
  company: string;
  batch: string;
  avatar?: string;
}

interface JobDetails {
  company: string;
  location: string;
  type: string;
  salary?: string;
  applyLink?: string;
  deadline?: string;
}

interface CommentData {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: string;
  };
  content: string;
  createdAt: string;
  likes?: { user: string }[];
  replies?: CommentReplyData[];
}

interface CommentReplyData {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  author: PostAuthor;
  type: 'job' | 'internship' | 'advice' | 'event' | 'question' | 'general';
  title: string;
  content: string;
  timestamp: Date;
  images?: string[];
  likes: number;
  comments: number;
  commentsData?: CommentData[];
  isLiked: boolean;
  isSaved: boolean;
  jobDetails?: JobDetails;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLikingPost, setIsLikingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Use local state for comments data to update instantly without refetching parent
  const [localCommentsData, setLocalCommentsData] = useState<CommentData[]>(post.commentsData || []);

  const handleLike = async () => {
    if (!user || isLikingPost) return;

    setIsLikingPost(true);
    const previousLiked = isLiked;
    const previousLikes = likes;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    try {
      if (isLiked) {
        await unlikePost(post.id);
        toast.success('Post unliked');
      } else {
        await likePost(post.id);
        toast.success('Post liked! ❤️');
      }
    } catch (error) {
      console.error('Like/unlike error:', error);
      // Revert on error
      setIsLiked(previousLiked);
      setLikes(previousLikes);
      toast.error('Failed to update like');
    } finally {
      setIsLikingPost(false);
    }
  };

  const handleSave = async () => {
    if (!user || isSavingPost) return;

    setIsSavingPost(true);
    const previousSaved = isSaved;

    // Optimistic update
    setIsSaved(!isSaved);

    try {
      if (isSaved) {
        await unsavePost(post.id);
        toast.success('Post removed from saved');
      } else {
        await savePost(post.id);
        toast.success('Post saved! 📌');
      }
    } catch (error) {
      console.error('Save/unsave error:', error);
      // Revert on error
      setIsSaved(previousSaved);
      toast.error('Failed to save post');
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await addComment(post.id, commentText);

      if (response.success) {
        // Update comment count
        setComments(comments + 1);
        setCommentText('');
        if (response.data) {
          setLocalCommentsData(prev => [...prev, response.data as any]);
        }
        toast.success('Comment added! 💬');
      } else {
        toast.error(response.message || 'Failed to add comment');
      }
    } catch (error: any) {
      console.error('Add comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplyToComment = async (commentId: string) => {
    if (!user || !replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);

    try {
      const response = await replyToComment(post.id, commentId, replyText);

      if (response.success && response.data) {
        setReplyText('');
        setReplyingTo(null);
        setLocalCommentsData(prev => prev.map(c => {
          if (c._id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), response.data as any]
            };
          }
          return c;
        }));
        toast.success('Reply added! 💬');
      } else {
        toast.error(response.message || 'Failed to add reply');
      }
    } catch (error: any) {
      console.error('Add reply error:', error);
      toast.error(error.response?.data?.message || 'Failed to add reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    try {
      // Optimistic update
      setLocalCommentsData(prev => prev.map(c => {
        if (c._id === commentId) {
          const hasLiked = c.likes?.some(l => l.user === user._id);
          const newLikes = hasLiked
            ? c.likes?.filter(l => l.user !== user._id)
            : [...(c.likes || []), { user: user._id }];
          return { ...c, likes: newLikes };
        }
        return c;
      }));
      await likeComment(post.id, commentId);
    } catch (error) {
      console.error('Like comment error:', error);
    }
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'linkedin' | 'copy') => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `${post.title} - ${post.content.substring(0, 100)}...`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        toast.success('Link copied! 📋');
        setTimeout(() => setCopied(false), 2000);
        break;
    }

    if (platform !== 'copy') {
      setShowShareModal(false);
      toast.success('Opening share dialog...');
    }
  };

  const getPostTypeBadge = () => {
    const badges: Record<string, { variant: any; text: string }> = {
      job: { variant: 'info', text: 'Job Opening' },
      internship: { variant: 'success', text: 'Internship' },
      advice: { variant: 'warning', text: 'Career Advice' },
      event: { variant: 'primary', text: 'Event' },
      question: { variant: 'secondary', text: 'Question' },
      general: { variant: 'default', text: 'Post' },
    };

    const badge = badges[post.type] || badges.general;
    return <Badge variant={badge.variant}>{badge.text}</Badge>;
  };

  const truncateContent = (content: string) => {
    if (showFullContent || content.length <= 300) return content;
    return content.substring(0, 300) + '...';
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Parse formatted content (markdown-style)
  const parseFormattedContent = (content: string) => {
    if (!content) return '';

    // Replace **text** with <strong>text</strong> (bold)
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace *text* with <em>text</em> (italic)
    formatted = formatted.replace(/(?<!\*)\*(?!\*)([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // Replace __text__ with <u>text</u> (underline)
    formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');

    // Replace [text](url) with <a href="url">text</a> (links)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline font-medium">$1</a>');

    return formatted;
  };

  return (
    <>
      <Card
        variant="elevated"
        className="overflow-hidden bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl mb-4"
      >
        {/* Post Header */}
        <div className="p-3 sm:p-5 md:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
              <Avatar
                src={post.author.avatar}
                alt={post.author.name}
                size="sm"
                fallback={post.author.name}
                className="cursor-pointer flex-shrink-0 mt-0.5"
                onClick={() => navigate(`/profile/${post.author.id}`)}
              />
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-sm sm:text-base text-gray-900 dark:text-white hover:underline cursor-pointer truncate"
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                >
                  {post.author.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate font-medium">
                  {post.author.role} {post.author.company && `@ ${post.author.company}`}
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                  <span className="font-medium hidden sm:inline">Batch of {post.author.batch}</span>
                  <span className="font-medium sm:hidden">{post.author.batch}</span>
                  <span>•</span>
                  <span>{getRelativeTime(post.timestamp)}</span>
                </div>
              </div>
            </div>
            <button className="p-1 sm:p-2 text-neutral-400 dark:text-gray-500 hover:text-neutral-600 dark:hover:text-gray-300 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
              <MoreVertical size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Post Type Badge */}
          <div className="mb-2 sm:mb-3">{getPostTypeBadge()}</div>

          {/* Post Title */}
          {post.title && (
            <h2
              className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors leading-tight"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.title}
            </h2>
          )}

          {/* Post Content */}
          <div
            className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseFormattedContent(truncateContent(post.content)) }}
          />
          {post.content.length > 300 && !showFullContent && (
            <button
              onClick={() => setShowFullContent(true)}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:underline font-medium transition-colors text-sm -mt-2 mb-3"
            >
              ...see more
            </button>
          )}

          {/* Job Details (if applicable) */}
          {(post.type === 'job' || post.type === 'internship') && post.jobDetails && (
            <div className="bg-neutral-50 dark:bg-gray-900/40 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-neutral-100 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 rounded-md p-2">
                  <Briefcase size={16} className="text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 dark:text-gray-400 font-medium">Company</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.jobDetails.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 rounded-md p-2">
                  <MapPin size={16} className="text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 dark:text-gray-400 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.jobDetails.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 rounded-md p-2">
                  <Badge variant="info" size="sm" className="font-semibold text-xs">{post.jobDetails.type}</Badge>
                </div>
                {post.jobDetails.salary && (
                  <div className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 rounded-md p-2">
                    <IndianRupee size={16} className="text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-gray-400 font-medium">Salary</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.jobDetails.salary}</p>
                    </div>
                  </div>
                )}
              </div>
              {post.jobDetails.applyLink && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-sm font-semibold rounded-full"
                  onClick={() => window.open(post.jobDetails?.applyLink, '_blank')}
                >
                  Apply Now
                </Button>
              )}
            </div>
          )}

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={`grid gap-1.5 sm:gap-2 mb-3 sm:mb-4 ${post.images.length === 1
                ? 'grid-cols-1'
                : post.images.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2'
                }`}
            >
              {post.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => window.open(image, '_blank')}
                >
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  {post.images!.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-xl sm:text-2xl font-bold">+{post.images!.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-gray-400 py-2 sm:py-3 border-t border-neutral-100 dark:border-gray-700 mt-2">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors">
              {likes} {likes === 1 ? 'like' : 'likes'}
            </span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors">
              {comments} {comments === 1 ? 'comment' : 'comments'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1 pb-1 border-t border-neutral-100 dark:border-gray-700 gap-1 sm:gap-2">
            <button
              onClick={handleLike}
              disabled={isLikingPost}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-md font-semibold text-sm transition-colors ${isLiked
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-neutral-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700'
                } ${isLikingPost ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-[bounce_0.5s_ease-in-out]' : ''} />
              <span className="hidden xs:inline">Like</span>
            </button>

            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-md font-semibold text-sm text-neutral-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="hidden xs:inline">Comment</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-md font-semibold text-sm text-neutral-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 size={18} />
              <span className="hidden xs:inline">Share</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSavingPost}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-md font-semibold text-sm transition-colors ${isSaved
                ? 'text-neutral-800 dark:text-white bg-neutral-100 dark:bg-gray-700'
                : 'text-neutral-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700'
                } ${isSavingPost ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
              <span className="hidden xs:inline">Save</span>
            </button>
          </div>

          {/* Comment Box */}
          {showCommentBox && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700 animate-slideDown">
              <div className="flex space-x-2 sm:space-x-3">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.firstName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-sky-100 dark:ring-gray-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-xs sm:text-sm">
                      {user?.firstName?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent resize-none transition-all duration-300 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCommentBox(false);
                        setCommentText('');
                      }}
                      className="hover:bg-gray-100 text-xs sm:text-sm px-3 sm:px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
                      isLoading={isSubmittingComment}
                    >
                      <Send size={14} className="mr-1 sm:w-4 sm:h-4" />
                      {isSubmittingComment ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Display Comments */}
          {localCommentsData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-4">
                {(showAllComments ? localCommentsData : localCommentsData.slice(0, 2)).map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    {/* Main Comment Avatar */}
                    {comment.user?.profilePicture ? (
                      <img
                        src={comment.user.profilePicture}
                        alt={`${comment.user?.firstName || 'User'} ${comment.user?.lastName || ''}`}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-100 dark:ring-gray-600 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // prevent infinite loop
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {/* Fallback avatar if no profile picture OR if image fails to load */}
                    <div className={`w-8 h-8 bg-sky-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 ${comment.user?.profilePicture ? 'hidden' : ''}`}>
                      <span className="text-sky-600 dark:text-sky-400 font-bold text-xs">
                        {comment.user?.firstName?.charAt(0) || 'U'}{comment.user?.lastName?.charAt(0) || ''}
                      </span>
                    </div>

                    <div className="flex-1">
                      {/* Main Comment Bubble */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {comment.user?.firstName || 'Unknown'} {comment.user?.lastName || 'User'}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getRelativeTime(new Date(comment.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center space-x-3 mt-1 ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${comment.likes?.some(l => l.user === user?._id) ? 'text-blue-600' : ''}`}
                        >
                          <ThumbsUp size={12} className={comment.likes?.some(l => l.user === user?._id) ? 'fill-current' : ''} />
                          {comment.likes?.length ? comment.likes.length : 'Like'}
                        </button>
                        <span>|</span>
                        <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="hover:text-blue-600 transition-colors">
                          Reply
                        </button>
                      </div>

                      {/* Nested Replies Rendering */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex space-x-2 mt-2">
                              {/* Reply Avatar */}
                              {reply.user?.profilePicture ? (
                                <img
                                  src={reply.user.profilePicture}
                                  alt={`${reply.user?.firstName || 'User'} ${reply.user?.lastName || ''}`}
                                  className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-100 dark:ring-gray-600 flex-shrink-0"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              {/* Reply Fallback avatar */}
                              <div className={`w-6 h-6 bg-sky-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 ${reply.user?.profilePicture ? 'hidden' : ''}`}>
                                <span className="text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                                  {reply.user?.firstName?.charAt(0) || 'U'}{reply.user?.lastName?.charAt(0) || ''}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl rounded-tl-none p-2.5 shadow-sm border border-gray-100 dark:border-gray-600">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-xs text-gray-900 dark:text-white">
                                      {reply.user?.firstName || 'Unknown'} {reply.user?.lastName || 'User'}
                                    </h4>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {getRelativeTime(new Date(reply.createdAt))}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Box Dropdown */}
                      {replyingTo === comment._id && (
                        <div className="flex space-x-2 mt-3 pl-2 animate-fadeIn">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.firstName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center">
                              <span className="text-sky-600 font-bold text-[10px]">{user?.firstName?.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 overflow-hidden px-3">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Add a reply..."
                              className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm focus:outline-none dark:text-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleReplyToComment(comment._id);
                              }}
                            />
                            <button
                              onClick={() => handleReplyToComment(comment._id)}
                              disabled={!replyText.trim() || isSubmittingReply}
                              className={`ml-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 p-1 ${(!replyText.trim() || isSubmittingReply) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {localCommentsData.length > 2 && (
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="mt-3 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                >
                  {showAllComments ? 'Show less' : `View all ${localCommentsData.length} comments`}
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-slideDown max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Share Post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 border border-green-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-gray-900">WhatsApp</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Share on WhatsApp</p>
                </div>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 border border-sky-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-gray-900">Twitter</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Share on Twitter</p>
                </div>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 border border-blue-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-gray-900">LinkedIn</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Share on LinkedIn</p>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {copied ? (
                    <Check size={20} className="text-white sm:w-6 sm:h-6" />
                  ) : (
                    <Copy size={20} className="text-white sm:w-6 sm:h-6" />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-gray-900">{copied ? 'Link Copied!' : 'Copy Link'}</p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
