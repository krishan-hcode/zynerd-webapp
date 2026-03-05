import {ArrowLeftIcon, BookmarkIcon} from '@heroicons/react/24/outline';
import {useRouter} from 'next/router';
import UserAvatar from '../common/UserAvatar';
const VideosHeader = () => {
  const router = useRouter();
  const handleSavedVideosClick = () => {
    router.push('/bookmark-collection');
  };
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 p-2 sm:p-[5.76px]">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-900 transition-colors mr-2 sm:mr-3 flex-shrink-0">
              <ArrowLeftIcon className="h-5 w-5 sm:h-5 sm:w-5" />
            </button>
            <h1 className="text-xl sm:text-2xl text-primary-dark font-besley truncate">
              Videos
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={handleSavedVideosClick}
              className="flex items-center gap-1.5 sm:gap-2 text-primary-dark font-inter text-xs sm:text-sm font-medium hover:text-primary-blue transition-colors"
              aria-label="Saved videos">
              <BookmarkIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="hidden sm:inline">Saved videos</span>
              <span className="sm:hidden">Saved</span>
            </button>
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};
export default VideosHeader;
