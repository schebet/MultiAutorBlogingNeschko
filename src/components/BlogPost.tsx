import React from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Eye, Tag, Share2 } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';
import { mockUsers } from '../data/mockData';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const author = mockUsers.find(user => user.id === post.authorId);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]); // Re-run when post changes

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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-amber-800 text-amber-50 px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Подели</span>
                  </button>
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
    </div>
  );
};

export default BlogPost;