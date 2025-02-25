import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusCircle, 
  User, 
  Star, 
  MessageCircle, 
  Layers, 
  Settings 
} from 'lucide-react';

// Mock data - in a real app, these would come from API calls
const categories = [
  { id: 1, name: 'Автомобили', icon: '🚗' },
  { id: 2, name: 'Недвижимость', icon: '🏠' },
  { id: 3, name: 'Работа', icon: '💼' },
  { id: 4, name: 'Услуги', icon: '🛠️' },
  { id: 5, name: 'Электроника', icon: '📱' },
];

const featuredAds = [
  { 
    id: 1, 
    title: 'Toyota Camry 2018', 
    price: '25 000 $', 
    image: 'https://via.placeholder.com/300x200?text=Toyota+Camry'
  },
  { 
    id: 2, 
    title: '2-комнатная квартира', 
    price: '85 000 $', 
    image: 'https://via.placeholder.com/300x200?text=Квартира'
  },
  { 
    id: 3, 
    title: 'iPhone 13 Pro', 
    price: '850 $', 
    image: 'https://via.placeholder.com/300x200?text=iPhone'
  },
];

const MainPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate user fetch - in real app, this would be an API call
    const fetchUser = async () => {
      // Simulated user data
      setUser({
        name: 'Алексей',
        avatar: 'https://ui-avatars.com/api/?name=Алексей'
      });
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">REKPARK</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{user.name}</span>
              </div>
            )}
            <Link 
              to="/create-ad" 
              className="bg-indigo-500 text-white px-4 py-2 rounded-full 
              flex items-center space-x-2 hover:bg-indigo-600 transition"
            >
              <PlusCircle size={20} />
              <span>Подать объявление</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
          <input 
            type="text" 
            placeholder="Найти объявление" 
            className="w-full px-4 py-3 text-gray-700 focus:outline-none"
          />
          <button className="bg-indigo-500 text-white px-6 py-3 hover:bg-indigo-600 transition">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <section className="container mx-auto px-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Категории</h2>
        <div className="grid grid-cols-5 gap-4">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/category/${category.id}`}
              className="bg-white rounded-lg shadow-md p-4 text-center 
              hover:bg-indigo-50 transition flex flex-col items-center"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Ads */}
      <section className="container mx-auto px-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Популярные объявления</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredAds.map(ad => (
            <div 
              key={ad.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden 
              hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img 
                src={ad.image} 
                alt={ad.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                <p className="text-indigo-600 font-bold">{ad.price}</p>
                <Link 
                  to={`/ad/${ad.id}`}
                  className="mt-3 block text-center bg-indigo-500 
                  text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between py-3">
            <Link 
              to="/" 
              className="flex flex-col items-center text-indigo-600"
            >
              <Home size={24} />
              <span className="text-xs mt-1">Главная</span>
            </Link>
            <Link 
              to="/search" 
              className="flex flex-col items-center text-gray-500 hover:text-indigo-600"
            >
              <Search size={24} />
              <span className="text-xs mt-1">Поиск</span>
            </Link>
            <Link 
              to="/favorites" 
              className="flex flex-col items-center text-gray-500 hover:text-indigo-600"
            >
              <Star size={24} />
              <span className="text-xs mt-1">Избранное</span>
            </Link>
            <Link 
              to="/chats" 
              className="flex flex-col items-center text-gray-500 hover:text-indigo-600"
            >
              <MessageCircle size={24} />
              <span className="text-xs mt-1">Чаты</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex flex-col items-center text-gray-500 hover:text-indigo-600"
            >
              <User size={24} />
              <span className="text-xs mt-1">Профиль</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainPage;