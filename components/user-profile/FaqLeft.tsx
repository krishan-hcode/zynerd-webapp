'use client';

import {FAQsIcon} from '@/elements/Icons';
import Colors from '@/styles/colors';
import type React from 'react';

const FaqLeft: React.FC = () => {
  return (
    <div className="h-full bg-primary-blue/10 px-6 py-10 lg:px-6 lg:py-6 flex justify-between items-center lg:items-start lg:justify-start  lg:flex-col">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-medium text-lightBlue-900 font-besley ">
        FAQs
      </h1>

      {/* Icon Box */}
      <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-0 lg:mb-4 lg:order-first">
        <FAQsIcon className="w-5 h-5 text-white" stroke={Colors.PRIMARY_BLUE} />
      </div>
    </div>
  );
};

export default FaqLeft;
