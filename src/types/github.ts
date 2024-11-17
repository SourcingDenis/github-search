export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  followers: number;
  following: number;
  company: string | null;
  html_url: string;
  most_used_language?: string | null;
}

export interface SearchResults {
  total_count: number;
  items: GitHubUser[];
}