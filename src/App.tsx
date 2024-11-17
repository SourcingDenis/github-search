import React, { useState } from 'react';
import { Github, Heart } from 'lucide-react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import { GitHubUser, SearchResults } from './types/github';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function AppContent() {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getMostUsedLanguage = async (username: string, headers: HeadersInit) => {
    try {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&per_page=10`,
        { headers }
      );
      
      if (!reposResponse.ok) return null;
      
      const repos = await reposResponse.json();
      const languages = repos.map((repo: any) => repo.language).filter(Boolean);
      
      if (languages.length === 0) return null;
      
      const languageCounts = languages.reduce((acc: Record<string, number>, lang: string) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)[0][0];
    } catch {
      return null;
    }
  };

  const searchUsers = async (page = 1) => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const query = encodeURIComponent(`${keyword} in:bio${location ? ` location:${location}` : ''}`);
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
      };

      const response = await fetch(
        `https://api.github.com/search/users?q=${query}&page=${page}&per_page=10`,
        { headers }
      );
      
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (response.status === 422) {
        throw new Error('Invalid search query. Please try a different search term.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users. Please try again.');
      }
      
      const searchData: SearchResults = await response.json();
      
      if (searchData.items.length === 0) {
        setUsers([]);
        setTotalCount(0);
        setError('No users found matching your search criteria.');
        return;
      }

      const detailedUsers = await Promise.all(
        searchData.items.map(async (user) => {
          try {
            const [userResponse, mostUsedLanguage] = await Promise.all([
              fetch(`https://api.github.com/users/${user.login}`, { headers }),
              getMostUsedLanguage(user.login, headers)
            ]);
            
            if (!userResponse.ok) {
              return {
                ...user,
                name: user.login,
                bio: '',
                location: null,
                blog: null,
                twitter_username: null,
                followers: 0,
                following: 0,
                company: null,
                most_used_language: null
              };
            }
            
            const userData = await userResponse.json();
            return {
              ...userData,
              most_used_language: mostUsedLanguage
            };
          } catch (err) {
            return {
              ...user,
              name: user.login,
              bio: '',
              location: null,
              blog: null,
              twitter_username: null,
              followers: 0,
              following: 0,
              company: null,
              most_used_language: null
            };
          }
        })
      );

      setUsers(detailedUsers);
      setTotalCount(Math.min(searchData.total_count, 1000));
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching.');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    searchUsers(page);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-end mb-4">
          <ThemeSwitcher />
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Github className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                GitHub Bio Search
              </h1>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Search for GitHub users by keywords in their bio
            </p>
          </div>

          <SearchBar 
            keyword={keyword}
            location={location}
            setKeyword={setKeyword}
            setLocation={setLocation}
            onSearch={() => searchUsers(1)}
          />

          <UserList 
            users={users}
            totalCount={totalCount}
            currentPage={currentPage}
            loading={loading}
            error={error}
            searchKeyword={keyword}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      
      <footer className={`py-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-center justify-center gap-1`}>
            Built with{' '}
            <a 
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-500"
            >
              Cursor
            </a>
            {' & '}
            <Heart 
              className="w-4 h-4 text-red-500 inline-block animate-pulse fill-current" 
              aria-label="love"
            />
            {' by '}
            <a 
              href="https://linkedin.com/in/sourcingdenis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-500"
            >
              @sourcingdenis
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;