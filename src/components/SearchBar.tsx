import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  keyword: string;
  location: string;
  setKeyword: (keyword: string) => void;
  setLocation: (location: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ 
  keyword, 
  location,
  setKeyword, 
  setLocation,
  onSearch 
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      <div className="relative flex items-center">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users by keyword in bio..."
          className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
      </div>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Filter by location (optional)"
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
}