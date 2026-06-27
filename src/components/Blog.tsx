import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, Clock, BookOpen, ChevronRight, X, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { MOCK_BLOGS } from '../data/blogs';
import { Blog } from '../types';

interface BlogMainProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export default function BlogMain({
  categoryFilter,
  setCategoryFilter
}: BlogMainProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Blog | null>(null);

  // In-session article likes tracking
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  const handleToggleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    setLikedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId) 
        : [...prev, articleId]
    );
  };

  const categoriesList = ['All', 'Buying Guides', 'Car Reviews', 'Maintenance Tips', 'Market Trends'];

  // Advanced search/category matching
  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter(blog => {
      // Category filter match
      if (categoryFilter !== 'All' && blog.category !== categoryFilter) {
        return false;
      }
      // Keyword search match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = blog.title.toLowerCase().includes(query);
        const summaryMatch = blog.summary.toLowerCase().includes(query);
        const contentMatch = blog.content.toLowerCase().includes(query);
        if (!titleMatch && !summaryMatch && !contentMatch) return false;
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Search Header and Categories Pills */}
      <div id="blog-header" className="mb-10 text-center max-w-3xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Knowledge Base & News</span>
          <h1 className="text-3xl sm:text-4.5xl font-black text-gray-900 tracking-tight leading-tight mt-1">VELOCITY INSIGHTS & GUIDES</h1>
          <p className="text-sm text-gray-500 mt-2">Equip yourself with expert used-car evaluations, routine mechanical maintenance schedules, market price projections, and smart purchasing checklists.</p>
        </div>

        {/* Search input + category pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
          <div className="relative w-full sm:w-2/5">
            <input 
              type="text" 
              placeholder="Search guides, tips, reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 border border-gray-150 rounded-xl text-xs bg-white text-gray-800 shadow-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center flex-1">
            {categoriesList.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs Layout Grid */}
      {filteredBlogs.length === 0 ? (
        <div id="blog-empty" className="bg-white border border-gray-150 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700">No Articles Match Query</h3>
          <p className="text-xs text-gray-450 mt-1 pb-4">Try refining your keyword queries or resetting the category tabs.</p>
          <button 
            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBlogs.map(blog => {
            const isLiked = likedArticles.includes(blog.id);
            return (
              <div 
                key={blog.id} 
                id={`article-${blog.id}`}
                onClick={() => setSelectedArticle(blog)}
                className="bg-white border border-gray-150/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group"
              >
                {/* Upper Cover image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                  />
                  
                  {/* Category Pill Badge */}
                  <span className="absolute top-3.5 left-3.5 bg-slate-900/90 text-amber-400 font-mono text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase">
                    {blog.category}
                  </span>

                  {/* Micro action button triggers */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(e, blog.id)}
                    className={`absolute top-3.5 right-3.5 p-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm ${
                      isLiked ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Article Info */}
                <div className="p-4.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-450 font-mono mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {blog.readTime}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-950 leading-snug group-hover:text-amber-500 transition-colors mb-2.5">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{blog.summary}</p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100 text-[10px] font-bold text-slate-900">
                    <span className="flex items-center gap-1.5 text-gray-450 font-medium">
                      <User className="w-3.5 h-3.5 text-amber-500" /> By {blog.author}
                    </span>
                    <span className="text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      Read File &rarr;
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Immersive Modal Full Reader Component */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full text-left relative max-h-[85vh] overflow-y-auto flex flex-col border border-gray-100"
            >
              
              {/* Cover cover with actions */}
              <div className="relative h-64 bg-slate-100">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 left-4 p-2.5 bg-slate-900/80 text-white hover:bg-slate-950 rounded-full cursor-pointer backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block bg-amber-500 text-slate-950 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded mb-2.5 uppercase">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">{selectedArticle.title}</h2>
                </div>
              </div>

              {/* Comprehensive text content */}
              <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono pb-3 border-b border-gray-100">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-amber-500" /> Writes: <strong>{selectedArticle.author}</strong></span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedArticle.date} ({selectedArticle.readTime})</span>
                </div>

                <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm font-medium">
                  {selectedArticle.content}
                </div>

                <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 flex gap-3 text-xs text-slate-800 leading-normal">
                  <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Velocity Certified Advice guarantee:</strong>
                    <p className="text-[11px] text-gray-550 mt-1">Our buyer guides are written by veteran automotive inspectors to secure absolute compliance and save you thousands in maintenance fees.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
