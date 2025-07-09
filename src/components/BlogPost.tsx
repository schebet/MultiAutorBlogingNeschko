import React from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Eye, Tag, Share2, Github, ArrowUp, PenTool } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';
import { getRegisteredAuthors } from '../data/authors';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const author = getRegisteredAuthors().find(user => user.id === post.authorId);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]); // Re-run when post changes

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to render markdown-like content as HTML
  const renderContent = (content: string) => {
    let html = content
      // Convert markdown images to HTML
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-md my-4" />')
      // Convert markdown links to HTML
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-800 hover:text-amber-900 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Convert markdown bold to HTML
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Convert markdown italic to HTML
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Convert markdown headings to HTML
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-5 mb-3">$1</h3>')
      // Convert markdown quotes to HTML
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-amber-500 pl-4 italic text-gray-700 my-4">$1</blockquote>')
      // Convert markdown lists to HTML
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      // Wrap consecutive list items in ul tags
      .replace(/(<li[^>]*>.*<\/li>\s*)+/gs, '<ul class="list-disc list-inside space-y-1 my-4">$&</ul>')
      // Convert line breaks (two spaces + newline) to HTML br tags
      .replace(/  \n/g, '<br />')
      // Convert line breaks to paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Wrap in initial paragraph tag
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>')
      // Clean up empty paragraphs
      .replace(/<p class="mb-4"><\/p>/g, '')
      // Handle HTML paragraph tags that might be in content
      .replace(/<p><\/p>/g, '<br />');
    
    return html;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      alert('Линк је копиран у клипборд!');
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-50 shadow-sm border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад на блог</span>
          </button>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-64 md:h-80">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {post.isFeature && (
                <div className="absolute top-4 left-4 bg-amber-800 text-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                  Издвојено
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{author?.name || 'Непознат аутор'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount} прегледа</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 font-medium">
              {post.excerpt}
            </p>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Тагови</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Подели:</span>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-amber-800 text-amber-50 px-3 py-2 rounded-lg hover:bg-amber-900 transition-colors text-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Општи</span>
                  </button>
                  <button
                    onClick={handleShareFacebook}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={handleShareTelegram}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span>Telegram</span>
                  </button>
                  <a
                    href="https://github.com/schebet/MultiAutorBlogingNeschko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </div>
                <div className="text-sm text-gray-500">
                  Последњи пут измењено: {formatDate(post.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        {author && (
          <div className="bg-amber-50 rounded-lg shadow-md p-6 mt-8">
            <div className="flex items-start space-x-4">
              <img
                src={author.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1'}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {author.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  {author.bio || 'Нема доступне биографије.'}
                </p>
                <p className="text-sm text-gray-500">
                  Члан од {formatDate(author.joinedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </article>

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

export default BlogPost;