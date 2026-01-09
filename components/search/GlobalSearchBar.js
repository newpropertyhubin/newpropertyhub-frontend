import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './GlobalSearchBar.module.css';

const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef(null);

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${API_URL}/api/search/suggestions?q=${searchQuery}`);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);


  const handleSuggestionClick = (url) => {
    setQuery('');
    setSuggestions([]);
    router.push(url);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      // Navigate to the first suggestion
      handleSuggestionClick(suggestions[0].url);
    }
  };

  return (
    <div className={styles.searchContainer} ref={searchContainerRef}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Location, Project, or Builder..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {loading ? (
            <li className={styles.suggestionItem}>Loading...</li>
          ) : (
            suggestions.map((item, index) => (
              <li
                key={index}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(item.url)}
              >
                <span className={styles.suggestionName}>{item.name}</span>
                <span className={styles.suggestionType}>{item.type}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default GlobalSearchBar;