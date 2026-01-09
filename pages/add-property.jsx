import React from 'react';
import Head from 'next/head';
import AddPropertyForm from '../components/AddPropertyForm';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const AddProperty = () => {
  const { status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p style={{textAlign: 'center', marginTop: '2rem'}}>Please <Link href="/login" style={{color: 'blue'}}>login</Link> to list a property.</p>;

  return (
    <>
      <Head>
        <title>List Your Property - NewPropertyHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>List Your Property</h1>
        <AddPropertyForm />
      </main>
    </>
  );
};

export default AddProperty;