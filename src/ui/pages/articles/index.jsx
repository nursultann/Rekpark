import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useArticlesQuery } from "../../../hooks/article";
import { useCategoriesQuery } from "../../../hooks/category";
import { maxSymbolEllipsis } from "../../../helpers/functions";
import { Search, Filter, CalendarDays, Clock, ArrowRight, ChevronRight } from "lucide-react";
import moment from "moment";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const navigateToArticle = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <div 
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={navigateToArticle}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {article.thumbnail_url ? (
          <img 
            src={article.thumbnail_url} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
        {article.is_featured && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-lg">
            Рекомендуемое
          </div>
        )}
        {article.category && (
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-lg">
            {article.category.name}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {maxSymbolEllipsis(article.content || article.description, 120)}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{moment(article.created_at).format("DD.MM.YYYY")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{article.read_time || '5 мин'} чтения</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleListSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({ categories, filters, updateFilters, loading }) => {
  const [searchText, setSearchText] = useState(filters.searchText || "");
  
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ searchText });
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden sticky top-20">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium">Фильтры</h3>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Поиск статей..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </form>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Категории</h4>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              <li>
                <button
                  className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100 transition-colors ${!filters.categories ? 'text-primary font-medium' : 'text-gray-700'}`}
                  onClick={() => updateFilters({ categories: '' })}
                >
                  Все категории
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100 transition-colors ${filters.categories === String(category.id) ? 'text-primary font-medium' : 'text-gray-700'}`}
                    onClick={() => updateFilters({ categories: String(category.id) })}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Тип</h4>
          <div className="space-y-2">
            <button
              className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100 transition-colors ${!filters.type ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => updateFilters({ type: '' })}
            >
              Все типы
            </button>
            <button
              className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100 transition-colors ${filters.type === 'article' ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => updateFilters({ type: 'article' })}
            >
              Статьи
            </button>
            <button
              className={`text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100 transition-colors ${filters.type === 'news' ? 'text-primary font-medium' : 'text-gray-700'}`}
              onClick={() => updateFilters({ type: 'news' })}
            >
              Новости
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedArticle = ({ article }) => {
  const navigate = useNavigate();

  if (!article) return null;

  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary to-blue-700 text-white mb-8 cursor-pointer"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-2 text-white/80 text-sm font-medium">Популярная статья</div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">{article.title}</h2>
          <p className="text-white/90 mb-4">
            {maxSymbolEllipsis(article.content || article.description, 150)}
          </p>
          <div className="mt-auto">
            <button className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
              Читать статью <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2 aspect-[16/9] md:aspect-auto relative overflow-hidden">
          {article.thumbnail_url ? (
            <img 
              src={article.thumbnail_url} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center">
              <span className="text-white/60">Нет изображения</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/50 md:bg-gradient-to-r" />
        </div>
      </div>
    </div>
  );
};

const ArticleListPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('category');
  const type = searchParams.get('type');
  
  const {
    articles,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    handlePageChange
  } = useArticlesQuery({
    categories: categoryId || '',
    type: type || '',
  });
  
  const {
    categories,
    loading: categoriesLoading,
  } = useCategoriesQuery();
  
  const [featuredArticle, setFeaturedArticle] = useState(null);
  
  useEffect(() => {
    if (articles && articles.length > 0) {
      // Find featured article or use the first one
      const featured = articles.find(article => article.is_featured) || articles[0];
      setFeaturedArticle(featured);
    }
  }, [articles]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Статьи и новости</h1>
        <Link 
          to="/" 
          className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
        >
          На главную <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <FilterSidebar 
            categories={categories} 
            filters={filters}
            updateFilters={updateFilters}
            loading={categoriesLoading}
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {loading && !articles?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleListSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : articles?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-medium mb-2">Статьи не найдены</h3>
              <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска или выбрать другую категорию</p>
              <button 
                onClick={() => updateFilters({ categories: '', type: '', searchText: '' })}
                className="text-primary hover:underline"
              >
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.total > pagination.perPage && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.ceil(pagination.total / pagination.perPage) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${
                          pagination.currentPage === i + 1
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;