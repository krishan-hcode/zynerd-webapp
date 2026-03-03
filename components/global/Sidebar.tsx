import LogoutModal from '@/common/LogoutModal';
import {INavbarLink} from '@/constants';
import {
  CerebellumIcon,
  HomeFillIcon,
  LiveFilledIcon,
  QbankFilledIcon,
  SideBarCloseIcon,
  TestFilledIcon,
  VideoFilledIcon,
} from '@/elements/Icons';
import {copyText, handleAppLogout} from '@/utils/helpers';
import {navbarLinks} from '@/utils/utils';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import MobileNavigation from './MobileNavigation';
import {UserContext} from './UserContext';

import {SESSION_STORAGE_MOCK_TEST_FILTERS} from '@/constants';

const Sidebar = () => {
  const router = useRouter();
  const {asPath} = router;
  const url = asPath.split('?')[0].split('/');
  const {s = ''} = router.query;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const dispatch = useDispatch();

  const {setAuthToken, userData, setUserData, userRole, setUserRole} =
    useContext(UserContext);

  const handleLogout = async () => {
    await handleAppLogout(
      setAuthToken,
      setUserData,
      setUserRole,
      dispatch,
      router,
    );
  };

  const copyRefferalCode = async () => {
    setIsCopied(true);
    copyText(userData?.referral_code);
    const timeout = setTimeout(() => {
      setIsCopied(false);
      clearTimeout(timeout);
    }, 3000);
  };

  const handleRouteChange = (menuItemUrl: string) => {
    if (menuItemUrl !== '/test') {
      sessionStorage.removeItem(SESSION_STORAGE_MOCK_TEST_FILTERS);
    }
  };

  const getMenuItemClasses = (
    url: string[] | undefined,
    menuItemUrl: string,
  ): string => {
    return url?.length && `/${url[1]}` === menuItemUrl
      ? 'w-full px-2 bg-primaryBlue/5 rounded-md text-primaryBlue py-1.5 flex relative after:absolute after:right-0 after:top-1/2 after:w-1 after:h-8 after:bg-primaryBlue after:rounded-r-md after:-translate-y-1/2'
      : 'w-full px-2 text-gray-90 py-1.5 hover:bg-gray-200 rounded-md flex font-medium';
  };

  const getMenuTextClasses = (
    url: string[] | undefined,
    menuItemUrl: string,
  ): string => {
    return url?.length && `/${url[1]}` === menuItemUrl
      ? 'px-2 text-primaryBlue'
      : 'px-2 text-gray-90';
  };
  const LiveGifIcon: React.FC = () => (
    <span className="relative flex items-center justify-center">
      <span
        className="absolute w-12 h-12 rounded-full opacity-90"
        style={{
          background:
            'url(/assets/liveSectionGif.gif) center / cover no-repeat',
        }}
      />
      <LiveFilledIcon className="relative w-5 h-5 text-secondary-red drop-shadow-[0_0_8px_rgba(255,100,102,0.85)]" />
    </span>
  );

  const getIconForMenuItem = (menuItem: INavbarLink, isActive: boolean) => {
    if (!isActive) return menuItem.icon;

    // Return filled icons for active menu items
    switch (menuItem.url) {
      case '/':
        return <HomeFillIcon className="w-5 h-5" />;
      case '/videos':
        return <VideoFilledIcon className="w-5 h-5" />;
      case '/qbank':
        return <QbankFilledIcon className="w-5 h-5" />;
      case '/live':
        return <LiveGifIcon />;
      case '/test':
        return <TestFilledIcon className="w-5 h-5" />;
      default:
        return menuItem.icon;
    }
  };

  return (
    <nav
      className={`${
        s == 'false' && 'hidden'
      } md:sticky md:top-0 md:border-r md:shadow-lg col-span md:h-screen transition-all duration-300 ease-in-out ${
        isCollapsed
          ? 'md:w-16 lg:w-16 xl:w-16'
          : 'md:min-w-[30vw] lg:min-w-[22vw] md:w-[22vw] max-w-[22vw] xl:min-w-[16vw] xl:max-w-[16vw]'
      }`}>
      <LogoutModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
      />
      <div className="mb-10 md:mb-0">
        <MobileNavigation userRole={userRole} />
      </div>
      <div className="hidden md:flex md:flex-col justify-between h-full">
        <div className="h-[93%]">
          {/* Navbar logo */}
          <Link
            href={'/'}
            className={`flex pt-5 mb-4 items-center opacity-90 bg-white transition-all duration-300 ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}>
            {isCollapsed ? (
              <div className="flex items-center justify-center">
                <span className="text-white text-sm">
                  <CerebellumIcon />
                </span>
              </div>
            ) : (
              <div className="text-gray-90 flex items-center justify-start gap-3 font-extrabold text-lg ml-5 font-sauce">
                <CerebellumIcon className="h-7 w-7" /> Cerebellum
              </div>
            )}
          </Link>
          {/* Navbar links */}
          <ul
            className={`font-inter text-indigo-900 font-bold space-y-1 text-xs transition-all duration-300 ${
              isCollapsed ? 'mx-2' : 'mx-4'
            }`}>
            {navbarLinks(userRole)?.map((menuItem: INavbarLink) => {
              const isActive = Boolean(
                url?.length && `/${url[1]}` === menuItem.url,
              );

              return (
                <Link
                  key={menuItem.id}
                  href={menuItem.url}
                  className={`transition-all duration-300 font-inter ${
                    isCollapsed
                      ? `w-full p-2 rounded-md flex justify-center items-center ${
                          isActive
                            ? 'bg-primaryBlue/5 text-primaryBlue'
                            : 'text-gray-90'
                        }`
                      : getMenuItemClasses(url, menuItem.url)
                  }`}
                  onClick={() => handleRouteChange(menuItem.url)}>
                  <div className={isCollapsed ? '' : 'mr-2'}>
                    {getIconForMenuItem(menuItem, isActive)}
                  </div>
                  {!isCollapsed && (
                    <li className={getMenuTextClasses(url, menuItem.url)}>
                      {menuItem.title}
                    </li>
                  )}
                </Link>
              );
            })}
          </ul>
        </div>
        <div
          className={`flex items-center transition-all duration-300 ${
            isCollapsed
              ? 'px-2 py-3 flex-col space-y-3'
              : 'px-4 py-5 justify-end'
          }`}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-200 rounded transition-all duration-300">
            <SideBarCloseIcon
              className={`w-5 h-5 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
      {/* navbar buttons */}
    </nav>
  );
};

export default Sidebar;
