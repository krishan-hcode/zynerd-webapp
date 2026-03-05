import {EllipsisVerticalIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import {useState} from 'react';
import type {IVideoCardProps} from '@/types/videos.types';
const VideoCard = ({video, onVideoClick}: IVideoCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="flex-shrink-0 w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] md:w-[300px] md:min-w-[300px] group">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-customGray-10 overflow-hidden hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div
          className="relative aspect-video cursor-pointer overflow-hidden touch-manipulation"
          onClick={() => onVideoClick?.(video)}>
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, 300px"
          />
          {/* ZyNerd branding overlay - top left */}
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 bg-white/90 rounded-md sm:rounded-lg flex items-center justify-center">
            <span className="text-primary-dark font-besleyBold text-xs sm:text-sm">Z</span>
          </div>
          {/* Tag overlay - top right (e.g. NEET UG 2025 or language) */}
          {video.tags && video.tags.length > 0 && (
            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 text-white text-[10px] sm:text-xs font-inter rounded sm:rounded-md">
                {video.tags[0]}
              </span>
            </div>
          )}
          {/* Play overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[14px] border-l-primary-blue border-y-[10px] border-y-transparent ml-1" />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="p-2.5 sm:p-3 flex gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className="text-xs sm:text-sm font-inter font-medium text-primary-dark num-lines-2 mb-0.5 sm:mb-1"
              onClick={() => onVideoClick?.(video)}>
              {video.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-customGray-60 font-inter">
              {video.uploadDate} • {video.language}
            </p>
          </div>
          {/* Options menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-customGray-5 text-customGray-60 hover:text-primary-dark transition-colors touch-manipulation">
              <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            {showOptions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowOptions(false)}
                />
                <div className="absolute right-0 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-customGray-10 z-20 min-w-[120px] sm:min-w-[140px]">
                  <button
                    onClick={() => setShowOptions(false)}
                    className="w-full px-4 py-2 text-left text-sm font-inter text-primary-dark hover:bg-customGray-5">
                    Save
                  </button>
                  <button
                    onClick={() => setShowOptions(false)}
                    className="w-full px-4 py-2 text-left text-sm font-inter text-primary-dark hover:bg-customGray-5">
                    Share
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCard;
