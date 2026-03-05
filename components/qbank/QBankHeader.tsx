import {classNames} from '@/utils/utils';
import {ArrowLeftIcon, BookmarkIcon} from '@heroicons/react/24/outline';
import UserAvatar from '../common/UserAvatar';
import {useRouter} from 'next/router';
export default function Header({
  title,
  searchPlaceholder = 'Search',
  showSearch = true,
  showBookmark = false,
  onSearch,
  onBookmarkClick,
  className = '',
  isBackNav,
  isEditMode = false,
  handleDonebtn,
}: any) {
  const router = useRouter();
  const handleBookmarkClick = () => {
    onBookmarkClick ? onBookmarkClick() : router.push('/bookmark-collection');
  };
  return (
    <header
      className={classNames(
        'w-full bg-white border-b border-gray-200 sticky top-0 z-50 p-[5.76px]',
        className,
      )}>
      <div className="w-full lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex">
            {isBackNav && (
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-900 transition-colors">
                <ArrowLeftIcon className="mr-3 h-5 w-5" />
              </button>
            )}
            <h1 className="text-2xl text-primary-dark font-besley">
              {isEditMode ? 'Edit Bookmarks' : title}
            </h1>
          </div>
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDonebtn}
                className="px-4 py-2 rounded-full bg-primary-dark text-white font-inter font-semibold text-sm hover:opacity-90 transition-opacity">
                Done
              </button>
            ) : (
              <>
                {/* Bookmark Icon */}
                {showBookmark && (
                  <button
                    onClick={handleBookmarkClick}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors duration-200"
                    aria-label="Bookmark">
                    <BookmarkIcon className="h-7 w-7 text-black" />
                  </button>
                )}
                <UserAvatar />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
