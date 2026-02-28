import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import TickerItemIcon from './TickerItemIcon';
import type { TickerItem as TickerItemType } from '../../services/ticker.service';
import { trackTickerClick } from '../../services/ticker.service';

interface TickerItemProps {
  item: TickerItemType;
  onClick?: () => void;
}

const variantStyles = {
  info: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
  success: 'bg-green-500/10 text-emerald-100 border-green-500/20 hover:bg-green-500/20',
  warning: 'bg-yellow-500/10 text-amber-100 border-yellow-500/20 hover:bg-yellow-500/20',
  urgent: 'bg-red-500/10 text-rose-100 border-red-500/20 hover:bg-red-500/20',
};

const iconColors = {
  info: 'text-sky-300',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  urgent: 'text-rose-400',
};

const TickerItem: React.FC<TickerItemProps> = ({ item, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Track click
    trackTickerClick(item._id);

    // Navigate if URL is provided
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border backdrop-blur-sm',
        'cursor-pointer transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-md',
        'min-w-max', // Prevent shrinking
        variantStyles[item.variant],
        item.variant === 'urgent' && 'animate-ticker-pulse'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${item.title}. ${item.message}. ${item.actionLabel || 'Click for more info'}`}
    >
      {/* Icon */}
      <TickerItemIcon type={item.type} variant={item.variant} size={16} className="flex-shrink-0" />

      {/* Content - Single line on mobile, two lines on desktop */}
      <div className="flex-1 min-w-0">
        {/* Mobile: Title only (single line) */}
        <p className="md:hidden font-semibold text-xs truncate">{item.title}</p>

        {/* Desktop: Title + Message */}
        <div className="hidden md:block">
          <p className="font-semibold text-sm truncate">{item.title}</p>
          <p className="text-xs opacity-80 truncate">{item.message}</p>
        </div>
      </div>

      {/* Action Indicator */}
      {item.actionLabel && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={cn('text-xs font-medium hidden md:inline', iconColors[item.variant])}>
            {item.actionLabel}
          </span>
          <ChevronRight size={14} className={iconColors[item.variant]} />
        </div>
      )}
    </div>
  );
};

export default TickerItem;
