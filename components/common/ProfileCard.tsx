'use client';

import {PencilIcon, ProfilePageIcon, ProfileTrophyIcon} from '@/elements/Icons';
import {classNames} from '@/utils/utils';
import Image from 'next/image';
import type React from 'react';

const ProfileCard: React.FC<any> = ({
  firstName,
  lastName,
  course,
  year,
  percentile,
  imageUrl,
  onEditProfile,
}) => {
  const isLandscape = window?.innerHeight < window?.innerWidth;
  return (
    <div className="relative">
      <div className="relative rounded-2xl h-32 px-4 flex items-end justify-end overflow-visible">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: "url('/assets/profileCard.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scaleX(-1) scaleY(-1)',
          }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-lightBlue-900/80 to-lightBlue-800/70 rounded-2xl"></div>

        <div className="absolute -top-8 left-5 z-30">
          {imageUrl ? (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src={imageUrl}
                alt={`${firstName} ${lastName} avatar`}
                width={80}
                height={80}
              />
            </div>
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg">
              <ProfilePageIcon className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          )}
        </div>

        {percentile && (
          <div className="absolute -top-8 -right-3 z-30">
            <div className="bg-orange_900 text-white px-3 py-2.5 rounded-lg flex items-center space-x-2 shadow-lg relative">
              <div className=" flex items-center justify-center">
                <ProfileTrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-bold font-inter leading-tight">
                <div>Top {percentile}</div>
                <div>Percentile</div>
              </div>
            </div>
          </div>
        )}
        <div
          className={classNames(
            'flex items-end justify-between mb-4 w-full z-20 relative',
            isLandscape ? 'mb-2' : 'mb-4', // add horizontal space in landscape
          )}>
          <div className="flex-1 space-y-1">
            <h2 className="text-white text-lg md:text-xl font-medium font-besley capitalize">
              {firstName} {lastName}
            </h2>
            <p className="text-white text-sm font-normal font-sauce">
              {course} - {year}
            </p>
          </div>

          <button
            onClick={onEditProfile}
            className="flex items-center space-x-1">
            <PencilIcon className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium font-inter">
              Edit Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;
