import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { PenTool, Save, X, Image, Upload, Trash2, Bold, Italic, List, Link, Quote, Type } from 'lucide-react';
import { BlogPost } from '../types';
import { mockPosts, updatePost } from '../data/mockData';

interface WritePostProps {
  onSave: (post: { title: string; content: string; excerpt: string; featuredImage?: string; category: string; tags: string[] }) => void;
  onCancel: () => void;
  editPostId?: string;
}

const WritePost: React.FC<WritePostProps> = ({ onSave, onCancel, editPostId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('Општи');
  const [tags, setTags] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Load post data when editing
  useEffect(() => {
    if (editPostId) {
      const storedPosts = localStorage.getItem('blogPosts');
      const posts = storedPosts ? JSON.parse(storedPosts) : mockPosts;
      const postToEdit = posts.find((post: BlogPost) => post.id === editPostId);
      
      if (postToEdit) {
        setIsEditing(true);
        setEditingPost(postToEdit);
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setExcerpt(postToEdit.excerpt);
        setFeaturedImage(postToEdit.featuredImage || '');
        setCategory(postToEdit.category);
        setTags(postToEdit.tags.join(', '));
      }
    }
  }, [editPostId]);

  // Listen for edit events
  useEffect(() => {
    const handleEditPost = (event: CustomEvent) => {
      const postId = event.detail;
      console.log('WritePost: Received edit event for post ID:', postId);
      
      const storedPosts = localStorage.getItem('blogPosts');
      const posts = storedPosts ? JSON.parse(storedPosts) : mockPosts;
      const postToEdit = posts.find((post: BlogPost) => post.id === postId);
      
      console.log('WritePost: Found post to edit:', postToEdit?.title);
      
      if (postToEdit) {
        setIsEditing(true);
        setEditingPost(postToEdit);
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setExcerpt(postToEdit.excerpt);
        setFeaturedImage(postToEdit.featuredImage || '');
        setCategory(postToEdit.category);
        setTags(postToEdit.tags.join(', '));
        console.log('WritePost: Post data loaded for editing');
      }
    };
    
    window.addEventListener('editPost', handleEditPost as EventListener);
    
    return () => {
      window.removeEventListener('editPost', handleEditPost as EventListener);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      if (isEditing && editingPost) {
        // Update existing post
        const updatedPost: BlogPost = {
          ...editingPost,
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.substring(0, 150) + '...',
          featuredImage: featuredImage.trim() || undefined,
          category: category,
          tags: tagArray,
          updatedAt: new Date().toISOString()
        };
        
        if (updatePost(editingPost.id, updatedPost)) {
          console.log('WritePost: Post updated successfully');
          onCancel(); // Go back to dashboard
        }
      } else {
        // Create new post
        onSave({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.substring(0, 150) + '...',
          featuredImage: featuredImage.trim() || undefined,
          category: category,
          tags: tagArray
        });
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturedImage(e.target.value);
  };

  const clearFeaturedImage = () => {
    setFeaturedImage('');
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = content;
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatText = (format: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'подебљан текст'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'курзив текст'}*`;
        break;
      case 'heading':
        formattedText = `\n## ${selectedText || 'Наслов'}\n`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'Ставка листе'}\n`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || 'Цитат'}\n`;
        break;
      case 'link':
        const url = prompt('Унесите URL:');
        if (url) {
          formattedText = `[${selectedText || 'текст линка'}](${url})`;
        }
        break;
    }
    
    if (formattedText) {
      insertTextAtCursor(formattedText);
    }
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const altText = imageAlt.trim() || 'Слика';
      const imageMarkdown = `\n![${altText}](${imageUrl})\n`;
      insertTextAtCursor(imageMarkdown);
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const insertParagraph = () => {
    insertTextAtCursor('\n\n');
  };

  const categories = [
    'Општи',
    'Књижевност', 
    'Култура',
    'Технологија',
    'Друштво',
    'Историја',
    'Традиција'
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-amber-200">
            <div className="flex items-center space-x-3">
              <PenTool className="w-6 h-6 text-amber-800" />
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Уреди чланак' : 'Напиши нови чланак'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Наслов чланка
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50 transition-colors"
                placeholder="Унесите наслов чланка..."
                required
              />
            </div>

            {/* Featured Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Наслovna слика
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={featuredImage}
                      onChange={handleImageUrlChange}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50 transition-colors"
                      placeholder="Унесите URL насловне слике..."
                    />
                  </div>
                  {featuredImage && (
                    <button
                      type="button"
                      onClick={clearFeaturedImage}
                      className="px-3 py-3 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      title="Уклони слику"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Image Preview */}
                {featuredImage && (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Преглед насловне слике"
                      className="w-full h-48 object-cover rounded-lg border border-amber-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      Преглед
                    </div>
                  </div>
                )}
                
                {/* Placeholder when no image */}
                {!featuredImage && (
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center bg-amber-50">
                    <Image className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      Унесите URL слике изнад за приказ насловне слике
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Препоручене димензије: 800x400px
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Категорија
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Тагови (одвојени зарезом)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50 transition-colors"
                  placeholder="традиција, култура, историја..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Кратак опис (опционо)
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50 transition-colors resize-none"
                placeholder="Кратак опис чланка..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Садржај чланка
              </label>
              
              {/* Rich Text Editor Toolbar */}
              <div className="border border-amber-300 rounded-t-lg bg-amber-50 p-2">
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Подебљано (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Курзив (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-amber-300 mx-1"></div>
                  
                  <button
                    type="button"
                    onClick={() => formatText('heading')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Наслов"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => formatText('list')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Листа"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => formatText('quote')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Цитат"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-amber-300 mx-1"></div>
                  
                  <button
                    type="button"
                    onClick={() => formatText('link')}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Линк"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowImageDialog(true)}
                    className="p-2 text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Убаци слику"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-amber-300 mx-1"></div>
                  
                  <button
                    type="button"
                    onClick={insertParagraph}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
                    title="Нови параграф"
                  >
                    &lt;p&gt;
                  </button>
                </div>
              </div>
              
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border-l border-r border-b border-amber-300 rounded-b-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition-colors resize-y font-mono text-sm"
                placeholder="Напишите садржај чланка овде... Користите алате изнад за форматирање."
                required
              />
              
              <div className="mt-2 text-xs text-gray-500">
                <p><strong>Савети за форматирање:</strong></p>
                <p>• Користите **текст** за подебљано, *текст* за курзив</p>
                <p>• ## за наслове, &gt; за цитате, - за листе</p>
                <p>• ![опис](URL) за слике, [текст](URL) за линкове</p>
                <p>• Два размака на крају реда + Enter за прелом реда</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Откажи
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-900 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Сачувај измене' : 'Сачувај чланак'}</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Image Dialog */}
        {showImageDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Убаци слику</h3>
                <button
                  onClick={() => setShowImageDialog(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL слике
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/slika.jpg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис слике (алт текст)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Опис слике за приступачност"
                  />
                </div>
                
                {/* Image Preview */}
                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Преглед:</p>
                    <img
                      src={imageUrl}
                      alt={imageAlt || 'Преглед слике'}
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowImageDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Откажи
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  disabled={!imageUrl.trim()}
                  className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Убаци слику
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritePost;