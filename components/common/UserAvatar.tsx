'use client';

import {PlaceholderUserIcon} from '@/elements/Icons';
import {useAppSelector} from 'lib/redux/hooks/appHooks';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

const UserAvatar = () => {
  const router = useRouter();
  const userInfo = useAppSelector(state => state.user.userInfo);

  // Get the image URL from image_file property
  const imageUrl = userInfo?.image_file;
  const userName =
    `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`?.trim() ||
    'User';

  return (
    <div className="flex-shrink-0 cursor-pointer">
      {imageUrl ? (
        <Image
          className="h-10 w-10 rounded-xl object-cover ring-2 ring-white hover:ring-gray-300 transition-all duration-200"
          src={imageUrl}
          alt={`${userName} avatar`}
          title={userName}
          width={32}
          height={32}
          onClick={() => {
            router.push('/user-profile');
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => router.push('/user-profile')}
          className="p-0 bg-transparent border-none focus:outline-none"
          aria-label="Go to profile">
          <PlaceholderUserIcon className="w-8 h-8 bg-lightBlue-400/10 rounded-lg mt-1" />
        </button>
      )}
    </div>
  );
};

export default UserAvatar;
