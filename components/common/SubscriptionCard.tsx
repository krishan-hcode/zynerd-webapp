import {PremiumHeaderIcon} from '@/elements/Icons';
import {UserIcon} from '@heroicons/react/24/solid';
import type React from 'react';
const SubscriptionCard: React.FC<any> = ({
  title,
  validity,
  icon: Icon = UserIcon,
  isActive = false,
}) => {
  return (
    <div className="bg-lightBlue-400/5 border border-lightBlue-400/20 rounded-xl p-3 md:p-4  relative">
      {/* Status badge in top-left corner */}
      <div className="absolute top-3 left-3">
        <span className="text-xs font-sauce font-medium text-lightBlue-400 bg-lightBlue-400/10 px-2 py-1 rounded-full">
          {isActive ? 'Active Subscription' : 'Expired Subscription'}
        </span>
      </div>
      {/* Main content area */}
      <div className="pt-8">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className="w-8 h-8 md:w-14 md:h-14 bg-lightBlue-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <PremiumHeaderIcon className="w-4 h-4 md:w-5 md:h-5 text-lightBlue-400" />
          </div>
          {/* Text content */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm md:text-base font-sauce font-semibold text-gray-900 mb-1 break-all">
              {title}
            </h3>
            <p className="text-xs text-gray-400 font-sauce">
              Validity: {validity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubscriptionCard;
