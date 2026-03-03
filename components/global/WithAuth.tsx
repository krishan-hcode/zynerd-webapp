import {AUTH_TOKEN_KEY} from '@/constants';
import {useRouter} from 'next/router';
import {ElementType, useContext, useEffect, useState} from 'react';
import {PuffLoader} from 'react-spinners';
import {UserContext} from './UserContext';

const publicRoutes = [
  '/login',
  '/otp',
  '/user-details',
  '/plans/premium-packages/[planId]',
  '/conference',
];

// Helper function to check if a pathname matches any public route pattern
const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes?.some(route => {
    // Convert Next.js route pattern to regex
    // Replace [param] with regex pattern to match any segment
    const pattern = route?.replace(/\[([^\]]+)\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
};

export default function withAuth(WrappedComponent: ElementType) {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const {userData} = useContext(UserContext);
    const [authToken, setAuthToken] = useState<string | null>('');

    useEffect(() => {
      setAuthToken(localStorage.getItem(AUTH_TOKEN_KEY));
    }, []);

    useEffect(() => {
      // Skip auth redirects for public routes
      if (isPublicRoute(router.pathname)) {
        return;
      }

      if (!authToken && authToken !== '') {
        router.replace('/login');
        return;
      }

      if (userData === null) {
        return;
      }

      if (authToken && !userData?.email) {
        router.replace('/user-details');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken, userData]);

    // Public routes should render immediately without requiring auth
    if (isPublicRoute(router.pathname)) {
      return <WrappedComponent {...props} />;
    }

    return (
      <>
        {authToken ? (
          <WrappedComponent {...props} />
        ) : (
          <div className=" h-screen-no-nav flex justify-center items-center w-full bg-gray-400 bg-opacity-20">
            <PuffLoader size={80} color="#376FEF" />
          </div>
        )}
      </>
    );
  };

  return Wrapper;
}
