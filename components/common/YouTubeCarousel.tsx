import useDeviceType from '@/hooks/useDeviceType';
import Image from 'next/image';
import React, {useCallback, useMemo, useRef, useState} from 'react';

interface VideoItem {
  video_link?: string;
  thumbnail?: string;
  title?: string;
}

interface YouTubeCarouselProps {
  videos: (string | VideoItem)[]; // Array of YouTube video IDs, URLs, or video objects
}

const GAP_BETWEEN_ITEMS = 16; // Tailwind gap-4

const YouTubeCarousel: React.FC<YouTubeCarouselProps> = ({videos}) => {
  const {isMobile} = useDeviceType();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playedVideos, setPlayedVideos] = useState<Set<number>>(new Set());

  const totalDots = useMemo(
    () => (!isMobile ? videos?.length - 1 : videos?.length),
    [isMobile, videos?.length],
  );
  const showPaginationDots = useMemo(
    () => (isMobile ? videos?.length > 1 : videos?.length > 2),
    [isMobile, videos?.length],
  );

  // Extract YouTube video ID from URL or use as-is if already an ID
  const getVideoId = useCallback((video: string | VideoItem): string => {
    let videoString = '';

    if (typeof video === 'string') {
      videoString = video;
    } else if (video?.video_link) {
      videoString = video.video_link;
    }

    if (!videoString) return '';

    // If it's already just an ID (no special characters except alphanumeric, dash, underscore)
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoString)) {
      return videoString;
    }

    // Extract from various YouTube URL formats
    const match = videoString.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    );
    return match?.[1] || videoString;
  }, []);

  // Get video thumbnail URL
  const getThumbnail = useCallback(
    (video: string | VideoItem, videoId: string): string => {
      if (typeof video === 'object' && video?.thumbnail) {
        return video.thumbnail;
      }
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },
    [],
  );

  // Get video title
  const getTitle = useCallback((video: string | VideoItem): string => {
    return typeof video === 'object' && video?.title
      ? video.title
      : 'YouTube video';
  }, []);

  // Handle video play
  const handleVideoPlay = useCallback((index: number) => {
    setPlayedVideos(prev => new Set(prev).add(index));
  }, []);

  // Handle scroll events - simplified like React Native version
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      // Ignore scroll events during programmatic scrolling to prevent flickering
      if (isProgrammaticScrollRef.current) return;

      const container = event.currentTarget;
      const firstChild = container.firstElementChild as HTMLElement;
      if (!firstChild) return;

      const itemWidth = firstChild.offsetWidth + GAP_BETWEEN_ITEMS;
      const contentOffset = container.scrollLeft;
      const index = Math.round(contentOffset / itemWidth);

      // Only update currentIndex if it's actually different to prevent unnecessary re-renders
      const newIndex = Math.max(0, Math.min(index, totalDots - 1));

      setCurrentIndex(prevIndex => {
        if (newIndex !== prevIndex) {
          return newIndex;
        }
        return prevIndex;
      });
    },
    [totalDots],
  );

  // Scroll to specific index - simplified
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const itemWidth = firstChild.offsetWidth + GAP_BETWEEN_ITEMS;
    const offset = index * itemWidth;

    // Set flag to ignore scroll events during programmatic scroll
    isProgrammaticScrollRef.current = true;
    setCurrentIndex(index);

    container.scrollTo({
      left: offset,
      behavior: 'smooth',
    });

    // Reset flag after scroll animation completes (smooth scroll typically takes ~300-500ms)
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 600);
  }, []);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Video Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
        }}
        onScroll={handleScroll}>
        {videos.map((video, index) => {
          const videoId = getVideoId(video);
          if (!videoId) return null;

          const isPlayed = playedVideos.has(index);
          const thumbnail = getThumbnail(video, videoId);
          const title = getTitle(video);
          const cardWidth = isMobile
            ? 'calc(100% - 0.5rem)'
            : 'min(1024px, calc(50% - 0.5rem))';

          return (
            <div
              key={`${videoId}-${index}`}
              className="flex-shrink-0"
              style={{
                minWidth: cardWidth,
                maxWidth: cardWidth,
                scrollSnapAlign: 'start',
              }}>
              <div
                className="relative w-full cursor-pointer"
                style={{paddingBottom: '56.25%'}}
                onClick={() => !isPlayed && handleVideoPlay(index)}>
                {!isPlayed ? (
                  <>
                    <Image
                      src={thumbnail}
                      alt={title}
                      fill
                      className="object-cover rounded-xl"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                      <Image
                        src="/assets/PlayVideo.svg"
                        alt="Play Video"
                        className="text-white"
                        width={30}
                        height={30}
                      />
                    </div>
                  </>
                ) : (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {showPaginationDots && (
        <div className="flex flex-row justify-center items-center mt-4 mb-2">
          {Array.from({length: totalDots}).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentIndex ? 'bg-primary-blue' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeCarousel;
