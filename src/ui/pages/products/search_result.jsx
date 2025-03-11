import React, { useState, useEffect } from "react";
import { fetchSearchProducts } from "../../../api/product";
import ProductItem, { ProductItemSkeleton } from "../../components/product/product_item";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const ProductsSearchResultPage = (match) => {
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [reachEnd, setReachEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const limit = 20;

  const fetchProducts = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const newProducts = await fetchSearchProducts({ 
        offset, 
        'with': 'user;region;city', 
        'searchText': searchQuery 
      });
      
      if (newProducts) {
        setProducts(prev => [...prev, ...newProducts]);
        setOffset(prev => prev + limit);
        
        if (newProducts.length < limit) {
          setReachEnd(true);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  if (initialLoad) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ищем товары...
        </h2>
        <p className="text-gray-500">
          Подождите, пока мы найдем товары по вашему запросу
        </p>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ничего не найдено
        </h2>
        <p className="text-gray-500">
          Попробуйте изменить параметры поиска
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Search Results Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Результаты поиска
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Search className="w-4 h-4" />
          <span>По запросу:</span>
          <span className="font-medium text-gray-900">
            "{searchQuery}"
          </span>
          <span className="text-gray-400">
            ({products.length} {products.length === 1 ? 'товар' : 'товаров'})
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'backwards'
            }}
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!reachEnd && (
        <div className="flex justify-center mt-12">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              'Загрузить еще'
            )}
          </button>
        </div>
      )}

      {/* Reached End Message */}
      {reachEnd && products.length > 0 && (
        <div className="text-center mt-12 text-gray-500">
          Больше товаров не найдено
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        [class*="grid"] > div {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductsSearchResultPage;