export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'author' | 'reader';
  avatar?: string;
  bio?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isFeature: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canEdit: (postId: string) => boolean;
  canModerate: () => boolean;
  canAdmin: () => boolean;
}