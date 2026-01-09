import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * @description Next.js ke liye behtar authentication hook.
 * Ye `next-auth` ka `useSession` use karta hai, jo server-side rendering ke saath aache se kaam karta hai.
 * `localStorage` par depend nahi karta, jo ki ek security risk hai aur SSR mein kaam nahi karta.
 * @param {{ required: boolean, requiredRoles: string[], onUnauthenticated: () => void }} options
 * @returns {{ session: object, user: object, status: 'loading'|'authenticated'|'unauthenticated', isAuthorized: boolean }}
 */
export const useAuth = (options = {}) => {
  const { required = false, requiredRoles = [], onUnauthenticated } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const loading = status === 'loading';
  
  // Check if user has one of the required roles
  const hasRequiredRole = requiredRoles.length === 0 || (user?.role && requiredRoles.includes(user.role));
  
  // User is authorized if they are authenticated and have the required role
  const isAuthorized = !!user && hasRequiredRole;

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    // If authentication is required and user is not logged in
    if (required && !user) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        router.push('/login');
      }
    }

    // If roles are required and user doesn't have them
    if (required && user && !hasRequiredRole) {
      router.push('/unauthorized');
    }
  }, [loading, user, hasRequiredRole, required, router, onUnauthenticated]);

  return { session, user, status, loading, isAuthorized };
};
