import React, { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Eye, User, Tag, ArrowRight, PenTool, ArrowUp, Github } from 'lucide-react';
import { BlogPost } from '../types';
import { mockPosts, mockCategories } from '../data/mockData';
import { getRegisteredAuthors } from '../data/authors';

interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Refresh posts when component mounts or when posts might have changed
  useEffect(() => {
    const refreshPosts = () => {
      const storedPosts = localStorage.getItem('blogPosts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(mockPosts);
      }
    };
    
    refreshPosts();
    
    // Listen for storage changes (when new posts are added)
    const handleStorageChange = () => {
      refreshPosts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when posts are updated in the same tab
    const handlePostsUpdate = () => {
      refreshPosts();
    };
    
    window.addEventListener('postsUpdated', handlePostsUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('postsUpdated', handlePostsUpdate);
    };
  }, []);
  
  const publishedPosts = posts.filter(post => post.status === 'published');
  const featuredPosts = publishedPosts.filter(post => post.isFeature);
  const regularPosts = publishedPosts.filter(post => !post.isFeature);

  const filteredPosts = regularPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorName = (authorId: string) => {
    const author = getRegisteredAuthors().find(user => user.id === authorId);
    return author ? author.name : 'Непознат аутор';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PostCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => (
    <article 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        featured ? 'lg:col-span-2' : ''
      }`}
      onClick={() => onSelectPost(post)}
    >
      {post.featuredImage && (
        <div className={`relative ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Издвојено
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{getAuthorName(post.authorId)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>

        <h2 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          {post.title}
        </h2>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{post.category}</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
            <span>Читај више</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 py-16 relative overflow-hidden">
        {/* Falling Leaves Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="leaf leaf-1">🍂</div>
          <div className="leaf leaf-2">🍂</div>
          <div className="leaf leaf-3">🍂</div>
          <div className="leaf leaf-4">🍂</div>
          <div className="leaf leaf-5">🍂</div>
          <div className="leaf leaf-6">🍂</div>
          <div className="leaf leaf-7">🍂</div>
          <div className="leaf leaf-8">🍂</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Заплањске приче
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Чувамо традицију, делимо приче и негујемо културу заплањског краја кроз речи наших писаца
            </p>
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-amber-50/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <h2 className="text-2xl font-semibold mb-4 text-center">О нама</h2>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  Чувамо традицију, делимо приче и негујемо културу заплањског краја
                </p>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  "Заплањске приче" је блог посвећен чувању и преношењу богате традиције, културе и историје заплањског краја. Кроз речи наших талентованих аутора, трудимо се да сачувамо од заборава приче, обичаје и мудрост наших предака.
                </p>
                <p className="text-lg text-amber-100 leading-relaxed mb-4">
                  Овај крај, смештен у срцу Балкана, одувек је био раскрсница култура и цивилизација. Његове планине, реке и села чувају у себи небројене приче које заслужују да буду испричане и пренете будућим генерацијама.
                </p>
                <p className="text-lg text-amber-100 leading-relaxed">
                  Наш блог је место где се сусрећу прошлост и садашњост, где традиција живи кроз савремене речи, а где сваки чланак представља мост између онога што јесмо и онога одакле долазимо.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'register' });
                  window.dispatchEvent(event);
                }}
                className="border-2 border-amber-50 text-amber-50 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5" />
                  <span>Придружи се ауторима</span>
                </div>
              </button>
              <a
                href="https://github.com/schebet/MultiAutorBlogingNeschko"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-amber-50 text-amber-50 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 hover:text-amber-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>GitHub пројекат</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Претражи чланке..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-800 text-amber-50'
                  : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              Све категорије
            </button>
            {mockCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                   ? 'bg-amber-800 text-amber-50'
                   : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Издвојени чланци</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <PostCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Најновији чланци</h2>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Нема чланака који одговарају вашем избору.</p>
            </div>
          )}
        </section>

        {/* Categories Sidebar */}
        <aside className="mt-12 bg-amber-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Категорије</h3>
          <div className="space-y-2">
            {mockCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className="text-gray-700 hover:text-amber-800 transition-colors"
                >
                  {category.name}
                </button>
                <span className="text-sm text-gray-500">{category.postCount}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-amber-800 text-amber-50 p-3 rounded-full shadow-lg hover:bg-amber-900 transition-all duration-300 z-50 hover:scale-110"
          title="Повратак на врх"
        >
          <div className="flex items-center justify-center">
            <PenTool className="h-5 w-5" />
            <ArrowUp className="h-4 w-4 ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};

export default BlogList;