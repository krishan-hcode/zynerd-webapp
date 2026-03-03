import Modal from '@/common/Modal';
import {PremiumHeaderIcon} from '@/elements/Icons';
import React from 'react';

const PremiumModal: React.FC<any> = ({isOpen, onClose, onBuyNow}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      containerAdditionalClasses="max-w-md"
      shouldHaveCrossIcon={true}
      modalClasses="">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <PremiumHeaderIcon className="text-white w-9 h-9" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-4xl font-besley text-gray-90 mb-3">Premium</h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          This feature is for premium users only. Please click on the button
          below to purchase.
        </p>

        {/* Buy Now Button */}
        <button
          onClick={onBuyNow}
          className="w-full bg-lightBlue-400 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors text-sm font-medium">
          Buy Now
        </button>
      </div>
    </Modal>
  );
};

export default PremiumModal;
