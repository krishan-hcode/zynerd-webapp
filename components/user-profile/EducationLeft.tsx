'use client';

import {EducationDetailIcon} from '@/elements/Icons';
import type React from 'react';

const EducationLeft: React.FC = () => {
  return (
    <div className="h-full bg-primary-blue/10 px-6 py-10 lg:px-6 lg:py-6 flex justify-between items-center lg:items-start lg:justify-start  lg:flex-col">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-medium text-lightBlue-900 font-besley ">
        Education Details
      </h1>

      {/* Icon Box */}
      <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-0 lg:mb-4 lg:order-first">
        <EducationDetailIcon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default EducationLeft;
