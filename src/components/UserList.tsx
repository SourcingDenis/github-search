import React from 'react';
import { GitHubUser } from '../types/github';
import UserProfile from './UserProfile';
import Pagination from './Pagination';

interface UserListProps {
  users: GitHubUser[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  onPageChange: (page: number) => void;
}

export default function UserList({ 
  users, 
  totalCount, 
  currentPage,
  loading, 
  error, 
  searchKeyword,
  onPageChange,
}: UserListProps) {
  const totalPages = Math.ceil(totalCount / 10);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mt-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mt-4">
      <p className="text-sm text-gray-600 mb-4">
        Found {totalCount.toLocaleString()} users matching your search
      </p>
      <div className="space-y-2">
        {users.map((user) => (
          <UserProfile 
            key={user.login} 
            user={user} 
            searchKeyword={searchKeyword}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}