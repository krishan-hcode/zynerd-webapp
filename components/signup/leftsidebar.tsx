// components/LeftSidebar.tsx
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import React from 'react';

interface LeftSidebarProps {
  step: number;
  onBack?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({step, onBack}) => {
  return (
    <div className="w-full lg:w-1/3 bg-primaryBlue/10 border-r border-[#d3e6ff] px-4 md:px-8 py-10 flex flex-col">
      {/* Back button */}

      <button
        onClick={onBack}
        className="flex items-center underline text-center rounded-md text-primary-dark text-lg font-bold mb-6">
        <ArrowLeftIcon className="w-5 h-5 text-primary-dark font-bold" />
      </button>

      {/* Title */}
      <div className="flex flex-row lg:flex-col items-center justify-between lg:items-start">
        <div className="justify-center items-center">
          <h2 className="text-3xl leading-10 font-mincho font-normal text-primary-dark  md:mt-6">
            {step === 1
              ? 'Personal Details'
              : step === 2
                ? 'Education Details'
                : 'Course/Exam'}
          </h2>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center space-x-4">
            <div
              className={`h-1 w-12 rounded ${
                step === 1 ? 'bg-primaryBlue' : 'bg-[#d1d5db]'
              }`}></div>
            <div
              className={`h-1 w-12 rounded ${
                step === 2 ? 'bg-primaryBlue' : 'bg-[#d1d5db]'
              }`}></div>
            <div
              className={`h-1 w-12 rounded ${
                step === 3 ? 'bg-primaryBlue' : 'bg-[#d1d5db]'
              }`}></div>
          </div>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary-blue/10 text-[#3b82f6] flex items-center justify-center shadow-sm lg:order-first">
          <span className="text-xl">
            {step === 1 ? (
              <img
                src="/assets/doctor.svg"
                alt="Doctor"
                className="w-6 h-6 inline"
              />
            ) : step === 2 ? (
              <img
                src="/assets/mortarboard.svg"
                alt="Mortarboard"
                className="w-6 h-6 inline"
              />
            ) : (
              <img
                src="/assets/Tests.svg"
                alt="Tests"
                className="w-6 h-6 inline"
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
