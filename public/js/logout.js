import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import Head from 'next/head';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Clear Local Storage (Custom Auth - Email/Password)
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // 2. Sign out from NextAuth (Google/Facebook)
    // redirect: false allows us to handle the redirect manually to /login
    signOut({ redirect: false }).then(() => {
      router.push('/login');
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Logout - NewPropertyHub</title>
      </Head>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>Logging out...</h2>
        <p>Please wait while we sign you out.</p>
      </div>
    </>
  );
};

export default Logout;