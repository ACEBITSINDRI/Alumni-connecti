import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, UserPlus, ExternalLink, Heart, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { getSuggestedConnections, type SuggestedConnection } from '../../services/user.service';
import { sendConnectionRequest } from '../../services/connection.service';

const RightSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [suggestedConnections, setSuggestedConnections] = useState<SuggestedConnection[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);

  // Fetch suggested connections
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSuggestedConnections(3);
        if (response.success && response.data) {
          setSuggestedConnections(response.data);
        }
      } catch (error) {
        console.error('Error fetching suggested connections:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Trending topics - TODO: Implement trending topics API
  const trendingTopics: { tag: string; posts: number }[] = [];

  // Featured alumni - TODO: Implement featured alumni API (currently commented out in JSX)
  // const featuredAlumni: {...} | null = null;

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUserId(userId);
      const response = await sendConnectionRequest(userId);

      if (response.success) {
        // Remove from suggestions after successful connection request
        setSuggestedConnections(prev => prev.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setConnectingUserId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 sticky top-20">
      {/* Trending Topics */}
      <Card variant="elevated" className="p-4 shadow-sm border border-neutral-200 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={20} className="text-neutral-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.tag)}`)}
            >
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-gray-200">{topic.tag}</p>
                <p className="text-xs text-neutral-500 dark:text-gray-400">{topic.posts} posts</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Alumni - TODO: Implement featured alumni API */}
      {/* Commented out until API is ready - prevents TypeScript errors with null value
      {featuredAlumni && (
        <Card variant="elevated" className="p-4">
          <Badge variant="warning" size="sm" className="mb-3">
            Alumni of the Month
          </Badge>
          <div className="text-center">
            <Avatar
              src={featuredAlumni.avatar}
              alt={featuredAlumni.name}
              size="xl"
              fallback={featuredAlumni.name}
              className="mx-auto mb-3"
            />
            <h4 className="font-semibold text-gray-900 mb-1">{featuredAlumni.name}</h4>
            <p className="text-sm text-gray-600 mb-1">{featuredAlumni.role}</p>
            <p className="text-sm text-gray-500 mb-2">{featuredAlumni.company}</p>
            <Badge variant="primary" size="sm" className="mb-3">
              Batch of {featuredAlumni.batch}
            </Badge>
            <p className="text-xs text-gray-600 mb-4">{featuredAlumni.description}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/profile/${featuredAlumni.id}`)}
            >
              View Profile
            </Button>
          </div>
        </Card>
      )}
      */}

      {/* Suggested Connections */}
      <Card variant="elevated" className="p-4 border border-neutral-200 shadow-sm bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <UserPlus size={20} className="text-neutral-600 dark:text-gray-400" />
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">Suggested Connections</h3>
          </div>
        </div>
        <div className="space-y-4">
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary-600" />
            </div>
          ) : suggestedConnections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500">No suggestions available</p>
            </div>
          ) : (
            suggestedConnections.map((user) => (
              <div key={user._id} className="flex flex-col p-3 rounded-xl border border-neutral-200 dark:border-gray-700 mb-3 bg-white dark:bg-gray-800">
                <div className="flex items-start space-x-3 mb-2">
                  <Avatar
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    size="md"
                    fallback={`${user.firstName[0]}${user.lastName[0]}`}
                    className="cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold text-neutral-900 dark:text-white truncate cursor-pointer hover:underline"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-xs text-neutral-600 truncate font-medium">{user.currentRole || (user.role === 'student' ? 'Student' : 'Alumni')}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.company || `Batch ${user.batch}`}</p>
                    {user.mutualConnections !== undefined && user.mutualConnections > 0 && (
                      <p className="text-xs text-neutral-400 mt-1">
                        {user.mutualConnections} mutual {user.mutualConnections === 1 ? 'connection' : 'connections'}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 font-semibold text-neutral-600 border-neutral-400 hover:bg-neutral-50 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center transition-all bg-transparent"
                      onClick={() => handleConnect(user._id)}
                      disabled={connectingUserId === user._id}
                    >
                      {connectingUserId === user._id ? (
                        <>
                          <Loader2 size={14} className="mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} className="mr-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => navigate('/alumni')}
          className="w-full mt-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
        >
          View All Alumni →
        </button>
      </Card >

      {/* Quick Actions */}
      < Card variant="elevated" className="p-4 shadow-sm border border-neutral-200 bg-white dark:bg-gray-800" >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <QuickActionButton
            icon={<Heart size={16} />}
            label="Donate to ACE"
            onClick={() => navigate('/donations')}
          />
          <QuickActionButton
            icon={<UserPlus size={16} />}
            label="Refer Alumni"
            onClick={() => navigate('/refer')}
          />
        </div>
      </Card >

      {/* ACE Website Link */}
      < Card variant="elevated" className="p-4 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white shadow-sm border border-neutral-800" >
        <div className="flex items-center justify-between mb-2 text-neutral-200">
          <h3 className="font-semibold text-white">Visit ACE BIT Sindri</h3>
          <ExternalLink size={18} />
        </div>
        <p className="text-sm text-neutral-400 mb-4">
          Explore more about the Association of Civil Engineers
        </p>
        <a
          href="https://acebits.in"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-2 bg-white text-primary-700 text-center rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Visit Website
        </a>
      </Card >
    </div >
  );
};

// QuickActionButton Component
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-gray-200 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
  >
    <div className="text-neutral-500 dark:text-gray-400">{icon}</div>
    <span>{label}</span>
  </button>
);

export default RightSidebar;
