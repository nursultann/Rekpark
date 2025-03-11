import React from 'react';
import useArticleListQuery from '../../hooks/article';
import moment from 'moment';

const NewsGrid = () => {
  const { articles, isLoading } = useArticleListQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-xl"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Featured article (first article)
  const featuredArticle = null;
  const remainingArticles = articles;

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <div 
          onClick={() => window.location.href = `/article/${featuredArticle.id}`}
          className="group cursor-pointer"
        >
          <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-64 md:h-full">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: featuredArticle.text
                  }}
                />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <i className="far fa-clock mr-2"></i>
                  {moment(featuredArticle.created_at).fromNow()}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <i className="far fa-heart mr-2"></i>
                  {featuredArticle.likes_count} likes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingArticles?.map((article) => (
          <div 
            key={article.id}
            onClick={() => window.location.href = `/article/${article.id}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div 
                className="text-gray-600 text-sm line-clamp-2 mb-3"
                dangerouslySetInnerHTML={{
                  __html: article.text
                }}
              />
              <div className="flex items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <i className="far fa-clock mr-1"></i>
                  {moment(article.created_at).fromNow()}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <i className="far fa-heart mr-1"></i>
                  {article.likes_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;