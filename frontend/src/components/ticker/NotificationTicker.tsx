import React, { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import TickerItem from './TickerItem';
import { useTickerItems, trackTickerView } from '../../services/ticker.service';

interface NotificationTickerProps {
  autoScroll?: boolean;
  scrollSpeed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  className?: string;
}

const NotificationTicker: React.FC<NotificationTickerProps> = ({
  autoScroll = true,
  scrollSpeed = 'normal',
  pauseOnHover = true,
  className,
}) => {
  const { data, isLoading, isError } = useTickerItems();
  const [isVisible, setIsVisible] = useState(true);
  const viewedItemsRef = useRef(new Set<string>());

  const items = data?.data && Array.isArray(data.data) ? data.data : [];

  // Track views for new items
  useEffect(() => {
    if (items.length > 0) {
      items.forEach((item) => {
        if (!viewedItemsRef.current.has(item._id)) {
          trackTickerView(item._id);
          viewedItemsRef.current.add(item._id);
        }
      });
    }
  }, [items]);

  // Don't render if no items or hidden
  if (!isVisible || (items.length === 0 && !isLoading && !isError)) {
    return null;
  }

  // Animation speed classes
  const speedClass = {
    slow: 'animate-marquee', // 30s
    normal: 'animate-marquee', // 30s
    fast: 'animate-marquee-fast', // 20s
  }[scrollSpeed];

  // Loading state
  if (isLoading) {
    return (
      <div className={cn(
        'sticky top-16 z-40',
        'bg-[#0B1A30]', // Solid or subtle gradient to match navbar
        'shadow-md border-b border-slate-700',
        'h-10 md:h-10 lg:h-9',
        className
      )}>
        <div className="flex items-center justify-center h-full text-white">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-xs md:text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state - silently fail (don't show error to user)
  if (isError) {
    console.warn('Ticker API failed - hiding ticker');
    return null; // Don't render anything on error
  }

  // Empty state - don't render
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'sticky top-16 z-40',
        'bg-gradient-to-r from-[#0B1A30] via-slate-800 to-[#0B1A30]', // Academic deep blue gradient
        'shadow-md overflow-hidden border-b border-[#1A2C47]',
        'h-10 md:h-10 lg:h-9',
        className
      )}
      role="marquee"
      aria-live="polite"
      aria-label="Notification ticker"
    >
      {/* Desktop: Horizontal Marquee */}
      <div className="hidden md:block h-full">
        <div
          className={cn(
            'flex items-center h-full',
            'gap-4 px-4',
            autoScroll && speedClass,
            pauseOnHover && 'hover:animation-play-state-paused'
          )}
        >
          {/* Render items twice for seamless loop */}
          {[...items, ...items].map((item, index) => (
            <TickerItem key={`${item._id}-${index}`} item={item} />
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Carousel */}
      <div className="md:hidden h-full">
        <MobileTickerCarousel items={items} />
      </div>

      {/* Close Button (optional) */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-0.5 right-0.5 text-slate-300 hover:text-white hover:bg-white/10 p-0.5 rounded transition-colors"
        aria-label="Close ticker"
      >
        <X className="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>
  );
};

// Mobile Carousel Component
interface MobileTickerCarouselProps {
  items: any[];
}

const MobileTickerCarousel: React.FC<MobileTickerCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative h-full flex items-center px-2">
      {/* Current Item */}
      <div className="w-full animate-ticker-fade-in">
        <TickerItem item={currentItem} />
      </div>

      {/* Dots Indicator - Hidden on very small screens */}
      {items.length > 1 && (
        <div className="hidden xs:flex absolute bottom-0.5 left-1/2 transform -translate-x-1/2 gap-1">
          {items.slice(0, 5).map((_, index) => ( // Show max 5 dots
            <div
              key={index}
              className={cn(
                'w-1 h-1 rounded-full transition-all',
                index === currentIndex % 5
                  ? 'bg-white w-2'
                  : 'bg-white/40'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationTicker;
