import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; // Import useState

export const useRequireAuth = (roles = [], redirectUrl = '/login') => { // Add roles parameter
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true); // Initialize loading state
  const [authorized, setAuthorized] = useState(false); // Initialize authorized state

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      setAuthorized(false); // Ensure authorized is false while loading
    } else {
      setLoading(false);
      if (status === 'unauthenticated') {
        router.push(redirectUrl);
        setAuthorized(false);
      } else if (status === 'authenticated') {
        // Check for roles if provided
        if (roles.length > 0) {
          // Assuming session.user.role exists and is a string or array of strings
          // For simplicity, let's assume session.user.role is a string for now.
          // You might need to adjust this based on your actual session.user.role structure.
          const userRole = session?.user?.role; // Assuming role is directly on user object
          const hasRequiredRole = roles.includes(userRole);
          
          if (!hasRequiredRole) {
            // Redirect or show unauthorized message
            router.push('/unauthorized'); // Or some other appropriate page
            setAuthorized(false);
          } else {
            setAuthorized(true);
          }
        } else {
          // If no roles are specified, just being authenticated is enough
          setAuthorized(true);
        }
      }
    }
  }, [session, status, router, redirectUrl, roles]);

  // Return loading, authorized, and session
  return { loading, authorized, session };
};