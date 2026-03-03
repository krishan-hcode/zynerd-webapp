import {DATE_FORMAT} from '@/constants';
import {ExclamationCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import {useAppDispatch} from 'lib/redux/hooks/appHooks';
import {updateSubscriptionBannerDate} from 'lib/redux/slices/userSlice';
import {FC, useState} from 'react';

interface IStickBanner {
  stickMessage: string;
  handleRenew: () => void;
}

const StickyBanner: FC<IStickBanner> = ({stickMessage, handleRenew}) => {
  const [isVisible, setIsVisible] = useState(true);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsVisible(false);
    // Record the last display date of the subscription banner.
    dispatch(
      updateSubscriptionBannerDate({
        lastBannerDate: dayjs().format(DATE_FORMAT),
      }),
    );
  };

  if (!isVisible || !stickMessage) return null;

  return (
    <div className="fixed bottom-0 md:top-0 md:bottom-auto w-full lg:max-w-[78%] md:max-w-[70%] xl:max-w-[84%] bg-blue-100 text-black shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-9 w-9 lg:h-6 lg:w-6  text-lightBlue-200 mr-2" />
          <p className="text-xs w-full lg:text-xs">{stickMessage}</p>
        </div>
        <div className="flex items-center gap-4 md:mr-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={handleRenew}>
            Renew
          </button>
          <button
            className="text-lightBlue-200 hover:text-lightBlue-400 focus:outline-none"
            onClick={handleClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyBanner;
