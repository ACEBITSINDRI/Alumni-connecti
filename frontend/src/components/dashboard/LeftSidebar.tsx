import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bookmark, Users, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { getUserStats } from '../../services/user.service';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'student' | 'alumni' | 'admin';
  profilePicture?: string;
  coverPhoto?: string;
  batch?: string;
  company?: string;
  currentRole?: string;
}

interface LeftSidebarProps {
  user: User | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    posts: 0,
    connections: 0,
    saved: 0,
    events: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch user stats (real-time update when user changes)
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await getUserStats();
        if (response.success && response.data) {
          setStats({
            posts: response.data?.postsCount ?? 0,
            connections: response.data?.connectionsCount ?? 0,
            saved: response.data?.savedPostsCount ?? 0,
            events: response.data?.eventsCount ?? 0,
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, user?.firstName, user?.lastName, user?.company, user?.currentRole]);

  // Upcoming events - TODO: Implement events API
  const upcomingEvents: any[] = [];

  if (!user) return null;

  return (
    <div className="space-y-6 sticky top-20">
      {/* User Profile Card */}
      <Card variant="elevated" className="overflow-hidden border border-neutral-200 shadow-sm bg-white dark:bg-gray-800">
        {/* Cover */}
        <div
          className="h-24 bg-neutral-200 dark:bg-gray-700 bg-cover bg-center"
          style={user.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})` } : {}}
        ></div>

        {/* Profile Info */}
        <div className="px-4 pb-4 -mt-12 text-center sm:text-left">
          <Avatar
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            size="xl"
            fallback={`${user.firstName?.[0]}${user.lastName?.[0]}`}
            className="border-4 border-white dark:border-gray-800 cursor-pointer mx-auto sm:mx-0 shadow-sm bg-white"
            onClick={() => navigate('/profile')}
          />

          <div className="mt-3">
            <h3
              className="font-bold text-neutral-900 cursor-pointer hover:text-primary-600 transition-colors text-lg"
              onClick={() => navigate('/profile')}
            >
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-neutral-600 font-medium">
              {user.role === 'student' ? 'Student' : 'Alumni'}
              {user.batch && ` • Batch ${user.batch}`}
            </p>
            {user.company && (
              <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">{user.company}</p>
            )}
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            className="w-full mt-4 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-gray-600 rounded-full hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card variant="elevated" className="p-4 border border-neutral-200 shadow-sm bg-white dark:bg-gray-800">
        <h3 className="font-bold text-neutral-900 dark:text-white mb-4 text-base">Quick Stats</h3>
        <div className="space-y-2">
          <StatItem
            icon={<FileText size={18} />}
            label="Posts Created"
            value={isLoadingStats ? '...' : stats.posts}
            onClick={() => navigate('/profile?tab=posts')}
          />
          <StatItem
            icon={<Users size={18} />}
            label="Connections"
            value={isLoadingStats ? '...' : stats.connections}
            onClick={() => navigate('/profile?tab=connections')}
          />
          <StatItem
            icon={<Bookmark size={18} />}
            label="Saved Posts"
            value={isLoadingStats ? '...' : stats.saved}
            onClick={() => navigate('/saved')}
          />
          <StatItem
            icon={<Calendar size={18} />}
            label="Events Registered"
            value={isLoadingStats ? '...' : stats.events}
            onClick={() => navigate('/events?filter=my-events')}
          />
        </div>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card variant="elevated" className="p-4 shadow-sm border border-neutral-200 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
            <button
              onClick={() => navigate('/events')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-primary-600 font-semibold">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="text-xs text-primary-600">
                      {event.date.split(' ')[1]}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Links */}
      <Card variant="elevated" className="p-4 shadow-sm border border-neutral-200 bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
        <div className="space-y-2">
          <QuickLink
            label="My Posts"
            onClick={() => navigate('/profile?tab=posts')}
          />
          <QuickLink
            label="Saved Posts"
            onClick={() => navigate('/saved')}
          />
          <QuickLink
            label="My Connections"
            onClick={() => navigate('/profile?tab=connections')}
          />
          <QuickLink
            label="Settings"
            onClick={() => navigate('/settings')}
          />
        </div>
      </Card>
    </div>
  );
};

// StatItem Component
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  onClick: () => void;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, onClick }) => (
  <div
    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <div className="text-neutral-500 dark:text-gray-400 group-hover:text-neutral-700 dark:group-hover:text-white">{icon}</div>
      <span className="text-sm text-neutral-600 dark:text-gray-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white">{label}</span>
    </div>
    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700">{value}</span>
  </div>
);

// QuickLink Component
interface QuickLinkProps {
  label: string;
  onClick: () => void;
}

const QuickLink: React.FC<QuickLinkProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-2 text-sm text-neutral-600 dark:text-gray-300 font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
  >
    {label}
  </button>
);

export default LeftSidebar;
