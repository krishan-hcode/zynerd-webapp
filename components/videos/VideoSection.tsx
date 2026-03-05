import {useRouter} from 'next/router';
import type {IVideoSectionProps} from '@/types/videos.types';
import VideoCard from './VideoCard';
const VideoSection = ({
  title,
  viewMoreUrl,
  videos,
  onVideoClick,
}: IVideoSectionProps) => {
  const router = useRouter();
  if (!videos || videos.length === 0) return null;
  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-besleySemibold text-primary-dark truncate">
          {title}
        </h2>
        {viewMoreUrl && (
          <button
            onClick={() => router.push(viewMoreUrl)}
            className="text-xs sm:text-sm font-inter font-medium text-primary-blue hover:text-primary-blue/90 transition-colors flex items-center gap-1 flex-shrink-0">
            View more
            <span className="text-primary-blue">›</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden overscroll-x-contain">
        <div className="flex gap-3 sm:gap-4 pb-2 min-w-max">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onVideoClick={onVideoClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default VideoSection;
