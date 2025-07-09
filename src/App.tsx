import React, { useState } from 'react';
import { useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WritePost from './components/WritePost';
import AuthorRegistration from './components/AuthorRegistration';
import { BlogPost as BlogPostType } from './types';
import { addPost } from './data/mockData';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('blog');
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);
  const [editPostId, setEditPostId] = useState<string | null>(null);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    setSelectedPost(null);
    if (page !== 'write') {
      setEditPostId(null);
    }
  }, []);

  // Listen for custom navigation events
  React.useEffect(() => {
    const handleCustomNavigateEvent = (event: CustomEvent) => {
      handleNavigate(event.detail);
    };
    
    window.addEventListener('navigate', handleCustomNavigateEvent as EventListener);
    return () => window.removeEventListener('navigate', handleCustomNavigateEvent as EventListener);
  }, [handleNavigate]);

  // Listen for edit post events
  React.useEffect(() => {
    const handleEditPostEvent = (event: CustomEvent) => {
      const postId = event.detail;
      console.log('App: Received edit post event for ID:', postId);
      setEditPostId(postId);
      setCurrentPage('write');
    };
    
    window.addEventListener('editPost', handleEditPostEvent as EventListener);
    return () => window.removeEventListener('editPost', handleEditPostEvent as EventListener);
  }, []);

  const handleSelectPost = (post: BlogPostType) => {
    setSelectedPost(post);
    setCurrentPage('post');
    // Scroll to top when selecting a post
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    setCurrentPage('blog');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleSavePost = (postData: { 
    title: string; 
    content: string; 
    excerpt: string; 
    featuredImage?: string; 
    category: string; 
    tags: string[] 
  }) => {
    if (!user) return;
    
    const newPost: BlogPostType = {
      id: Date.now().toString(),
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      slug: postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      authorId: user.id,
      category: postData.category,
      tags: postData.tags,
      status: 'published',
      featuredImage: postData.featuredImage,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      isFeature: false
    };
    
    addPost(newPost);
    setCurrentPage('dashboard');
  };
  const renderContent = () => {
    switch (currentPage) {
      case 'blog':
        return <BlogList onSelectPost={handleSelectPost} />;
      case 'post':
        return selectedPost ? (
          <BlogPost post={selectedPost} onBack={handleBackToBlog} />
        ) : (
          <BlogList onSelectPost={handleSelectPost} />
        );
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'write':
        return (
          <WritePost 
            onSave={handleSavePost} 
            onCancel={() => handleNavigate('dashboard')} 
            editPostId={editPostId || undefined}
          />
        );
      case 'register':
        return <AuthorRegistration onBack={() => handleNavigate('blog')} onLoginSuccess={handleLoginSuccess} />;
      case 'about':
        return (
          <div className="min-h-screen bg-amber-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-amber-100 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">О нама</h1>
                <div className="prose prose-lg max-w-none">
                  <p>
                    Чувамо традицију, делимо приче и негујемо културу заплањског краја
                  </p>
                  <p>
                    "Заплањске приче" је блог посвећен чувању и преношењу богате традиције, културе и историје заплањског краја. Кроз речи наших талентованих аутора, трудимо се да сачувамо од заборава приче, обичаје и мудрост наших предака.
                  </p>
                  <p>
                    Овај крај, смештен у срцу Балкана, одувек је био раскрсница култура и цивилизација. Његове планине, реке и села чувају у себи небројене приче које заслужују да буду испричане и пренете будућим генерацијама.
                  </p>
                  <p>
                    Наш блог је место где се сусрећу прошлост и садашњост, где традиција живи кроз савремене речи, а где сваки чланак представља мост између онога што јесмо и онога одакле долазимо.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="min-h-screen bg-amber-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-amber-100 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Контакт</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Пошаљите нам поруку</h2>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Име
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Е-адреса
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Порука
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-amber-800 text-amber-50 px-6 py-2 rounded-md hover:bg-amber-900 transition-colors"
                      >
                        Пошаљи поруку
                      </button>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Контакт информације</h2>
                    <div className="space-y-3">
                      <p>
                        <strong>Е-адреса:</strong> seloschebet@gmail.com
                      </p>
                      <p>
                        <strong>Администратор:</strong> Ђорић Ненад
                      </p>
                      <p>
                        <strong>Радно време:</strong> Понедељак - Петак, 09:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <BlogList onSelectPost={handleSelectPost} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;