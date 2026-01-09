import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import GlobalSearchBar from './search/GlobalSearchBar';


const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-xl font-bold flex-shrink-0">
          <Link href="/" className="hover:text-gray-300 no-underline text-white">
            🏠 NewPropertyHub
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex w-full max-w-xl mx-auto">
          <GlobalSearchBar />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center flex-shrink-0">
          <Link href="/" className="hover:text-blue-300 no-underline text-white">Home</Link>
          <Link href="/property" className="hover:text-blue-300 no-underline text-white">Properties</Link>
          <Link href="/premium-listing" className="hover:text-yellow-300 no-underline text-white font-medium">Premium</Link>
          <Link href="/add-property" className="hover:text-blue-300 no-underline text-white">Add Property</Link>
          <Link href="/business-network" className="hover:text-blue-300 no-underline text-white">Business Network</Link>
          <Link href="/blog" className="hover:text-blue-300 no-underline text-white">Blogs</Link>
          <Link href="/map-view" className="hover:text-blue-300 no-underline text-white">Map View</Link>
          
          {session ? (
            <div className="flex items-center gap-4">
               <span className="text-sm hidden lg:inline">Hello, {session.user?.name || 'User'}</span>
               <Link href="/user-dashboard" className="hover:text-blue-300 no-underline text-white">Dashboard</Link>
               <button 
                 onClick={() => signOut()} 
                 className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
               >
                 Logout
               </button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors no-underline text-white">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="p-4">
            <GlobalSearchBar />
          </div>
          <nav className="p-4 pt-0 flex flex-col gap-4">
          <Link href="/" className="hover:text-blue-300 no-underline text-white block">Home</Link>
          <Link href="/property" className="hover:text-blue-300 no-underline text-white block">Properties</Link>
          <Link href="/premium-listing" className="hover:text-yellow-300 no-underline text-white block">Premium</Link>
          <Link href="/add-property" className="hover:text-blue-300 no-underline text-white block">Add Property</Link>
          <Link href="/business-network" className="hover:text-blue-300 no-underline text-white block">Business Network</Link>
          <Link href="/blog" className="hover:text-blue-300 no-underline text-white block">Blogs</Link>
          <Link href="/map-view" className="hover:text-blue-300 no-underline text-white block">Map View</Link>
          
          {session ? (
            <>
               <div className="text-sm text-gray-300">Signed in as {session.user?.name}</div>
               <Link href="/user-dashboard" className="hover:text-blue-300 no-underline text-white block">Dashboard</Link>
               <button 
                 onClick={() => signOut()} 
                 className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm w-full text-left"
               >
                 Logout
               </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors no-underline text-white block text-center">
              Login
            </Link>
          )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
