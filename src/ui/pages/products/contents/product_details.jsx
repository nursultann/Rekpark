import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Heart, Share2, Clock, User, AlertTriangle } from 'lucide-react';
import moment from 'moment';

const SimpleAlert = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    {children}
  </div>
);

const ProductDetails = ({ product, comments, onShowPhone, onSendMessage, onShare, onFavorite }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Продукт не найден</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            {product.media?.length > 0 ? (
              <img 
                src={product.media[selectedImage].original_url} 
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Нет фото</span>
              </div>
            )}
            {product.is_vip && (
              <div className="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                VIP
              </div>
            )}
            {product.is_urgent && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Срочно
              </div>
            )}
          </div>

          {/* Thumbnail Grid */}
          {product.media?.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {product.media.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image.original_url} 
                    alt={`${product.title} - фото ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {moment(product.created_at).format('DD.MM.YYYY')}
              </span>
              {product.city?.name && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {product.city.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-gray-900">
              {product.price?.toLocaleString()} {product.currency_symbol}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={onFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Добавить в избранное"
              >
                <Heart className={`w-6 h-6 ${product.is_favorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
              <button 
                onClick={onShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Поделиться"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              {product.user?.avatar ? (
                <img 
                  src={product.user.avatar} 
                  alt={product.user.name} 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{product.user?.name}</h3>
                <p className="text-sm text-gray-500">
                  На сайте с {moment(product.user?.created_at).format('MMMM YYYY')}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {product.phones?.[0] && (
                <button 
                  onClick={() => {
                    setShowPhone(!showPhone);
                    if (onShowPhone) onShowPhone();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {showPhone ? product.phones[0] : 'Показать телефон'}
                </button>
              )}
              <button 
                onClick={onSendMessage}
                className="w-full flex items-center justify-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Написать сообщение
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Описание</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Custom Attributes */}
          {product.custom_attribute_values?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.custom_attribute_values.map((attr, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{attr.attribute_title}</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Tips */}
          <SimpleAlert>
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Советы по безопасности:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Не отправляйте деньги до получения товара</li>
                  <li>Встречайтесь в публичных местах</li>
                  <li>Проверяйте товар перед покупкой</li>
                </ul>
              </div>
            </div>
          </SimpleAlert>
        </div>
      </div>

      {/* Comments Section */}
      {comments?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">
            Комментарии ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4 mb-2">
                  {comment.user?.avatar ? (
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{comment.user?.name}</div>
                    <div className="text-sm text-gray-500">
                      {moment(comment.created_at).fromNow()}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;