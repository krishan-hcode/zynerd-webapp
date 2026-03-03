'use client';

import {collegeStates, collegeYears} from '@/constants';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  LocationIcon,
  PencilIcon,
} from '@/elements/Icons';
import {RootState} from 'lib/redux/store';
import type React from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import EducationEditModal from './EducationEditModal';

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  onEdit?: () => void;
}> = ({icon, label, value}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <div className="text-xs font-inter font-medium text-customGray-50 mb-1 ">
            {label}
          </div>
          <div className="text-sm font-sauce font-medium text-customGray-90">
            {value || '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationRight: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.userInfo);
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to get display value for college_state and current_year
  const getDisplayValue = (value: any, isCollegeState = false) => {
    if (typeof value === 'object' && value?.name) {
      return value.name;
    }
    if (typeof value === 'string' && value) {
      // If it's a string, try to find the corresponding name from constants
      if (isCollegeState) {
        const stateObj = collegeStates.find(s => s.key === value);
        return stateObj?.name || value;
      } else {
        const yearObj = collegeYears.find(y => y.key === value);
        return yearObj?.name || value;
      }
    }
    return undefined;
  };
  return (
    <div className=" bg-white rounded-2xl px-6 py-5 h-full">
      <div className="flex flex-row justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1 flex-shrink-0 text-lightBlue-800 hover:text-lightBlue-900 text-sm font-inter font-medium py-2 rounded-lg transition-colors">
          <PencilIcon className="w-5 h-5" />
          <span>Edit</span>
        </button>
      </div>
      <Row
        icon={<AcademicCapIcon className="w-6 h-6 text-customGray-80" />}
        label="Course"
        value={
          typeof userData?.course === 'object'
            ? (userData?.course as any)?.name
            : undefined
        }
      />
      <Row
        icon={<LocationIcon className="w-6 h-6 text-customGray-80" />}
        label="College State"
        value={getDisplayValue(userData?.college_state, true)}
      />
      <Row
        icon={<BuildingOfficeIcon className="w-4 h-4 text-customGray-80" />}
        label="College"
        value={userData?.college?.name}
      />
      <Row
        icon={<CalendarDaysIcon className="w-5 h-5 text-customGray-80" />}
        label="Current Year"
        value={getDisplayValue(userData?.current_year, false)}
      />
      <EducationEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default EducationRight;
