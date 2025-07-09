import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockPosts } from '../data/mockData';
import { getRegisteredAuthors } from '../data/authors';
import { deletePost } from '../data/mockData';
import { deleteAuthor } from '../data/authors';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, canAdmin, canModerate } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(getRegisteredAuthors());
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when component mounts and when posts are updated
  useEffect(() => {
    const refreshData = () => {
      const storedPosts = localStorage.getItem('blogPosts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
      
      setUsers(getRegisteredAuthors());
    };
    
    refreshData();
    
    // Listen for posts updates
    const handlePostsUpdate = () => {
      refreshData();
    };
    
    window.addEventListener('postsUpdated', handlePostsUpdate);
    
    return () => {
      window.removeEventListener('postsUpdated', handlePostsUpdate);
    };
  }, []);

  const userPosts = posts.filter(post => 
    user?.role === 'super_admin' || user?.role === 'editor' || post.authorId === user?.id
  );

  const draftPosts = userPosts.filter(post => post.status === 'draft');
  const publishedPosts = userPosts.filter(post => post.status === 'published');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleDeletePost = (postId: string) => {
    if (canAdmin() && confirm('Да ли сте сигурни да желите да обришете овај чланак?')) {
      if (deletePost(postId)) {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setRefreshKey(prev => prev + 1);
        alert('Чланак је успешно обрисан!');
      }
    }
  };

  const handleEditPost = (postId: string) => {
    console.log('Dashboard: Editing post with ID:', postId);
    
    // Verify post exists before navigating
    const storedPosts = localStorage.getItem('blogPosts');
    const currentPosts = storedPosts ? JSON.parse(storedPosts) : posts;
    const postExists = currentPosts.find(post => post.id === postId);
    
    console.log('Dashboard: Available posts:', currentPosts.map(p => ({ id: p.id, title: p.title })));
    console.log('Dashboard: Looking for post:', postId);
    console.log('Dashboard: Post exists:', !!postExists);
    
    if (!postExists) {
      console.error('Dashboard: Post not found:', postId);
      alert('Чланак није пронађен!');
      return;
    }
    
    console.log('Dashboard: Post found, dispatching edit event for:', postExists.title);
    
    // First navigate to write page, then dispatch edit event
    onNavigate('write');
    
    // Dispatch edit event after navigation
    setTimeout(() => {
      console.log('Dashboard: Dispatching edit event after navigation');
      const event = new CustomEvent('editPost', { detail: postId });
      window.dispatchEvent(event);
    }, 200);
  };

  const handleDeleteUser = (userId: string) => {
    if (canAdmin() && userId !== user?.id && confirm('Да ли сте сигурни да желите да обришете овог корисника?')) {
      if (deleteAuthor(userId)) {
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        setRefreshKey(prev => prev + 1);
        alert('Корисник је успешно обрисан!');
      }
    }
  };


  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = 
    ({ title, value, icon, color }) => (
      <div className="bg-amber-50 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    );

  const PostsList: React.FC<{ posts: typeof mockPosts; title: string }> = ({ posts, title }) => (
    <div className="bg-amber-50 rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-amber-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-amber-200">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Нема чланака за приказ
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="p-6 hover:bg-amber-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditPost(post.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Уреди чланак - отвориће се страница за уређивање"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {canAdmin() && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {!canAdmin() && (
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Преглед', icon: BarChart3 },
    { id: 'posts', label: 'Чланци', icon: FileText },
    ...(canAdmin() || canModerate() ? [{ id: 'users', label: 'Корисници', icon: Users }] : []),
    { id: 'settings', label: 'Подешавања', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Контролна табла</h1>
          <p className="mt-2 text-gray-600">
            Добродошли назад, {user?.name}! Управљајте својим садржајем и праћите перформансе.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-800 border-b-2 border-amber-800'
                    : 'text-gray-700 hover:text-amber-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Укупно чланака"
                value={userPosts.length}
                icon={<FileText className="h-6 w-6 text-amber-50" />}
                color="bg-amber-800"
              />
              <StatCard
                title="Објављени"
                value={publishedPosts.length}
                icon={<Eye className="h-6 w-6 text-amber-50" />}
                color="bg-green-500"
              />
              <StatCard
                title="Нацрти"
                value={draftPosts.length}
                icon={<Edit3 className="h-6 w-6 text-amber-50" />}
                color="bg-yellow-500"
              />
              <StatCard
                title="Прегледи"
                value={userPosts.reduce((sum, post) => sum + post.viewCount, 0)}
                icon={<BarChart3 className="h-6 w-6 text-amber-50" />}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Posts */}
            <PostsList key={`overview-${refreshKey}`} posts={userPosts.slice(0, 5)} title="Најновији чланци" />
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Управљање чланцима</h2>
              <button
                onClick={() => onNavigate('write')}
                className="flex items-center space-x-2 bg-amber-800 text-amber-50 px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Нови чланак</span>
              </button>
            </div>

            {/* Posts List */}
            <PostsList key={`posts-${refreshKey}`} posts={userPosts} title="Сви чланци" />
          </div>
        )}

        {activeTab === 'users' && (canAdmin() || canModerate()) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Управљање корисницима</h2>
            
            <div className="bg-amber-50 rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-amber-200">
                <h3 className="text-lg font-semibold text-gray-900">Корисници</h3>
              </div>
              <div className="divide-y divide-amber-200">
                {users.map(userItem => (
                  <div key={userItem.id} className="p-6 hover:bg-amber-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={userItem.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1'}
                          alt={userItem.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{userItem.name}</h4>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userItem.role === 'super_admin' 
                            ? 'bg-red-100 text-red-800'
                            : userItem.role === 'editor'
                            ? 'bg-amber-100 text-amber-800'
                            : userItem.role === 'author'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userItem.role === 'super_admin' ? 'Супер админ' :
                           userItem.role === 'editor' ? 'Уредник' :
                           userItem.role === 'author' ? 'Аутор' : 'Читалац'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {userItem.isActive ? 'Активан' : 'Неактиван'}
                        </span>
                        {canAdmin() && userItem.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Обриши корисника"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Подешавања</h2>
            
            <div className="bg-amber-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Профил</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Е-адреса
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Биографија
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={user?.bio}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                  />
                </div>
                <button className="bg-amber-800 text-amber-50 px-4 py-2 rounded-md hover:bg-amber-900 transition-colors">
                  Сачувај измене
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;