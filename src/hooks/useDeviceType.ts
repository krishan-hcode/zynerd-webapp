import {useEffect, useState} from 'react';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const getDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;

      // Check if it's an iPad specifically
      const isIPad =
        /iPad|Macintosh/.test(userAgent) && 'ontouchend' in document;

      // Check if it's a tablet based on user agent patterns
      // Android tablets have "Android" but NOT "Mobile" in user agent
      // Phones have "Android Mobile" in user agent
      const isTabletUserAgent =
        /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Silk/i.test(userAgent);

      // Check if it's a mobile phone (excluding tablets)
      const isMobilePhone =
        /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );

      // Prioritize user agent detection for tablets
      if (isIPad || isTabletUserAgent) {
        return 'tablet';
      }

      // If user agent indicates mobile phone, check screen size
      // Tablets typically have width >= 600px
      if (isMobilePhone) {
        // If it's a mobile user agent but screen is tablet-sized, it might be a tablet
        // However, if user agent explicitly says mobile, trust it for small screens
        if (width >= 600 && 'ontouchend' in document) {
          return 'tablet';
        }
        return 'mobile';
      }

      // Fallback to screen size detection
      if (width >= 1024) {
        return 'desktop';
      } else if (width >= 600) {
        // Check if it has touch capability (likely tablet)
        if ('ontouchend' in document) {
          return 'tablet';
        }
        return 'desktop';
      } else {
        return 'mobile';
      }
    };

    const updateDeviceInfo = () => {
      const type = getDeviceType();
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDeviceInfo({
        type,
        isMobile: type === 'mobile',
        isTablet: type === 'tablet',
        isDesktop: type === 'desktop',
        width,
        height,
      });
    };

    // Initial check
    updateDeviceInfo();

    // Add event listener for window resize
    window.addEventListener('resize', updateDeviceInfo);

    // Add event listener for orientation change (for mobile devices)
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceType;
