import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Layout = ({ children }) => {
  const { data: session } = useSession();

  // Helper function to determine the correct dashboard path
  const getDashboardPath = (role) => {
    switch (role) {
      case 'user':
        return '/user-dashboard';
      case 'admin':
        return '/admin-dashboard';
      case 'broker':
        return '/dashboard-broker'; // From file listing
      case 'builder':
        return '/builder-dashboard'; // Assuming this is the path
      case 'owner':
        return '/dashboard-owner'; // From file listing
      default:
        return '/user-dashboard'; // A generic fallback
    }
  };

  return (
    <>
      <header className="main-header">
        <div className="header-top">
          <Link href="/" style={{ textDecoration: 'none', color: '#0b6efd', fontSize: '1.5rem', fontWeight: 'bold' }}>
            NewPropertyHub
          </Link>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/property">Properties</Link>
            <Link href="/premium-listing">Premium</Link>
            {session && session.user ? (
              <>
                <Link href={getDashboardPath(session.user.role)}>Dashboard</Link>
                <button onClick={() => signOut()} className="btn-nav" style={{ border: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register" className="btn-nav">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; {new Date().getFullYear()} NewPropertyHub. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;