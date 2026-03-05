import Modal from '@/common/Modal';
import {INavbarLink, SESSION_STORAGE_MOCK_TEST_FILTERS} from '@/constants';
import {
  CerebellumBulbIcon,
  LogoutIcon,
  SideBarCloseIcon,
} from '@/elements/Icons';
import {copyText, handleAppLogout} from '@/utils/helpers';
import {navbarLinks} from '@/utils/utils';
import {Dialog, Transition} from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Fragment, useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {UserContext} from './UserContext';

import {
  HomeFillIcon,
  LiveFilledIcon,
  QbankFilledIcon,
  TestFilledIcon,
  VideoFilledIcon,
} from '@/elements/Icons';

export default function MobileNavigation({userRole = ''}: {userRole: string}) {
  const [open, setOpen] = useState(false);
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(
    new Set(),
  );

  const toggleSubMenu = (menuId: number) => {
    setExpandedMenuIds(prev => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const isSubMenuItemActive = (menuItem: INavbarLink) =>
    menuItem.items?.some(sub => asPath.startsWith(sub.url));
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const {setAuthToken, userData, setUserData, setUserRole} =
    useContext(UserContext);
  const router = useRouter();
  const {asPath} = router;
  const url = asPath.split('?')[0].split('/');
  const dispatch = useDispatch();

  const copyRefferalCode = async () => {
    setIsCopied(true);
    copyText(userData?.referral_code);
    const timeout = setTimeout(() => {
      setIsCopied(false);
      clearTimeout(timeout);
    }, 3000);
  };

  const handleLogout = async () => {
    await handleAppLogout(
      setAuthToken,
      setUserData,
      setUserRole,
      dispatch,
      router,
    );
  };

  const handleRouteChange = (menuItemUrl: string) => {
    setOpen(false);
    if (menuItemUrl !== '/test') {
      sessionStorage.removeItem(SESSION_STORAGE_MOCK_TEST_FILTERS);
    }
  };

  const getMenuItemClasses = (
    url: string[] | undefined,
    menuItemUrl: string,
    isParentActive?: boolean,
  ): string => {
    const isActive =
      (url?.length && `/${url[1]}` === menuItemUrl) || isParentActive;
    return isActive
      ? 'w-full px-2 bg-primaryBlue/5 rounded-md text-primaryBlue py-1.5 flex items-center relative after:absolute after:right-2 after:top-1/2 after:w-1 after:h-8 after:bg-primaryBlue after:rounded-r-md after:-translate-y-1/2'
      : 'w-full px-2 text-gray-90 py-1.5 hover:bg-gray-200 rounded-md flex items-center font-medium';
  };

  const getSubMenuItemClasses = (subItemUrl: string): string => {
    return asPath.startsWith(subItemUrl)
      ? 'w-full pl-8 pr-2 py-2 bg-primaryBlue/5 rounded-md text-primaryBlue flex items-center text-sm font-medium'
      : 'w-full pl-8 pr-2 py-2 text-gray-90 hover:bg-gray-100 rounded-md flex items-center text-sm font-medium';
  };

  const getMenuTextClasses = (
    url: string[] | undefined,
    menuItemUrl: string,
    isParentActive?: boolean,
  ): string => {
    const isActive =
      (url?.length && `/${url[1]}` === menuItemUrl) || isParentActive;
    return isActive ? 'px-2 text-primaryBlue' : 'px-2 text-gray-90';
  };

  const getIconForMenuItem = (menuItem: INavbarLink, isActive: boolean) => {
    if (!isActive) return menuItem.icon;

    // Return filled icons for active menu items
    switch (menuItem.url) {
      case '/':
        return <HomeFillIcon className="w-5 h-5" />;
      case '/videos':
        return <VideoFilledIcon className="w-5 h-5" />;
      case '/insights':
      case '/qbank':
        return <QbankFilledIcon className="w-5 h-5" />;
      case '/live':
        return <LiveFilledIcon className="w-5 h-5" />;
      case '/test':
        return <TestFilledIcon className="w-5 h-5" />;
      default:
        return menuItem.icon;
    }
  };

  return (
    <div className="fixed z-50 bg-white w-screen mb-10 top-0  md:hidden px-3 pt-3 shadow-md">
      <Modal
        shouldHaveCrossIcon
        onClose={() => setIsModalVisible(false)}
        isOpen={isModalVisible}
        containerAdditionalClasses="max-w-lg">
        <div className="flex flex-col items-center">
          <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-8 border-slate-100 border-opacity-10 bg-slate-200">
            <LogoutIcon />
          </span>

          <h3 className="mb-2 text-2xl font-bold text-gray-800">Sign out</h3>
          <p className="text-gray-500">
            Are you sure you would like to sign out of your account?
          </p>

          <div className="mt-6 flex justify-center gap-x-4">
            <button
              onClick={handleLogout}
              className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
              Sign out
            </button>
            <button
              onClick={() => setIsModalVisible(false)}
              type="button"
              className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div id="burger-icon">
        <Bars3Icon className="w-8 mr-2" onClick={() => setOpen(!open)} />
      </div>
      <div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-[999]" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className=" pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full">
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="flex items-center gap-3 ml-2">
                              <span className="bg-primaryBlue/5 h-8 w-8 border border-primaryBlue/50 flex items-center justify-center rounded-lg">
                                <CerebellumBulbIcon />
                              </span>

                              <span className="text-xl font-semibold leading-6 text-gray-90 font-sauce">
                                Cerebellum
                              </span>
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center"></div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 sm:px-6">
                          <ul className="flex flex-col space-y-2 ml-6 text-lg">
                            {navbarLinks(userRole)?.map(
                              (menuItem: INavbarLink) => {
                                const hasSubItems =
                                  menuItem.items && menuItem.items.length > 0;
                                const isExpanded =
                                  expandedMenuIds.has(menuItem.id);
                                const isActive = Boolean(
                                  url?.length &&
                                    `/${url[1]}` === menuItem.url,
                                );
                                const isParentActive =
                                  hasSubItems &&
                                  isSubMenuItemActive(menuItem);

                                if (hasSubItems) {
                                  return (
                                    <li key={menuItem.id} className="space-y-1">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className={`cursor-pointer ${getMenuItemClasses(
                                          url,
                                          menuItem.url,
                                          isParentActive,
                                        )}`}
                                        onClick={() =>
                                          toggleSubMenu(menuItem.id)
                                        }
                                        onKeyDown={e =>
                                          e.key === 'Enter' &&
                                          toggleSubMenu(menuItem.id)
                                        }>
                                        <div className="mr-2">
                                          {getIconForMenuItem(
                                            menuItem,
                                            isActive || isParentActive,
                                          )}
                                        </div>
                                        <span
                                          className={getMenuTextClasses(
                                            url,
                                            menuItem.url,
                                            isParentActive,
                                          )}>
                                          {menuItem.title}
                                        </span>
                                        <span className="ml-auto">
                                          {isExpanded ? (
                                            <ChevronUpIcon className="w-4 h-4" />
                                          ) : (
                                            <ChevronDownIcon className="w-4 h-4" />
                                          )}
                                        </span>
                                      </div>
                                      {isExpanded && (
                                        <ul className="mt-1 space-y-0.5">
                                          {menuItem.items?.map(subItem => (
                                            <li key={subItem.id}>
                                              <Link
                                                href={subItem.url}
                                                className={getSubMenuItemClasses(
                                                  subItem.url,
                                                )}
                                                onClick={() =>
                                                  handleRouteChange(
                                                    subItem.url,
                                                  )
                                                }>
                                                <span className="mr-2">
                                                  {subItem.icon}
                                                </span>
                                                {subItem.title}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                }

                                return (
                                  <Link
                                    onClick={() =>
                                      handleRouteChange(menuItem.url)
                                    }
                                    href={menuItem.url}
                                    key={menuItem.id}
                                    className={getMenuItemClasses(
                                      url,
                                      menuItem.url,
                                    )}>
                                    <div className="mr-2">
                                      {getIconForMenuItem(menuItem, isActive)}
                                    </div>
                                    <li
                                      className={getMenuTextClasses(
                                        url,
                                        menuItem.url,
                                      )}>
                                      {menuItem.title}
                                    </li>
                                  </Link>
                                );
                              },
                            )}
                          </ul>
                        </div>

                        <div className="px-6 border-t flex justify-between pt-4 items-center">
                          {/* Logout Button */}
                          <span
                            onClick={() => {
                              setOpen(false);
                              setIsModalVisible(true);
                            }}
                            className="p-2 hover:bg-gray-200 rounded transition-all duration-300">
                            <LogoutIcon className="w-5 h-5" />
                          </span>

                          {/* Close Button */}
                          <span
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-gray-200 rounded transition-all duration-300">
                            <SideBarCloseIcon className="w-6 h-6" />
                          </span>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}
