import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../../../hooks/product';
import { useCategoriesTree } from '../../../hooks/category';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  X,
  MapPin,
  CheckCircle2,
  Car,
  Home,
  Briefcase,
  Wrench,
  Package,
  Smartphone,
  ShoppingBag,
  MoreHorizontal,
  DollarSign,
  Filter,
  ChevronRight,
  Video
} from 'lucide-react';
import ProductItem, { ProductItemSkeleton } from '../../components/product/product_item';

// Category kinds enum similar to Flutter code
const CategoryKind = {
  CARS: 'cars',
  REALTY: 'realty',
  JOBS: 'jobs',
  SERVICES: 'services',
  OBJECTS: 'objects',
  ELECTRONICS: 'electronics',
  CLOTHINGS: 'clothing_shoes_accessories',
  OTHER: 'other'
};

// Category kind icon mapping
const CategoryKindIcon = {
  [CategoryKind.CARS]: <Car className="w-5 h-5" />,
  [CategoryKind.REALTY]: <Home className="w-5 h-5" />,
  [CategoryKind.JOBS]: <Briefcase className="w-5 h-5" />,
  [CategoryKind.SERVICES]: <Wrench className="w-5 h-5" />,
  [CategoryKind.OBJECTS]: <Package className="w-5 h-5" />,
  [CategoryKind.ELECTRONICS]: <Smartphone className="w-5 h-5" />,
  [CategoryKind.CLOTHINGS]: <ShoppingBag className="w-5 h-5" />,
  [CategoryKind.OTHER]: <MoreHorizontal className="w-5 h-5" />
};

// Generic category search field component
const CategorySearchField = ({ field, value, onChange }) => {
  const { type, name, label, placeholder, options, groupName } = field;

  // Handle different field types similar to Flutter CustomAttributeType
  switch (type) {
    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{label}</label>
          <select 
            value={value || ''} 
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{placeholder || `Выберите ${label}`}</option>
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );

    case 'multiselect':
    case 'array':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{label}</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
            {options?.map(option => (
              <label key={option} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={value?.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(value || []), option]
                      : (value || []).filter(v => v !== option);
                    onChange(name, newValue);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'boolean':
      return (
        <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(name, e.target.checked)}
              className="rounded border-gray-300 w-5 h-5"
            />
          </label>
        </div>
      );

    case 'number':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{label}</label>
          <input
            type="number"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );

    case 'textual':
    default:
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
  }
};

// Car Attributes Component (similar to CarAttributesBody in Flutter)
const CarFilters = ({ values = {}, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [carTypes, setCarTypes] = useState([]);
  const [carMarks, setCarMarks] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carGenerations, setCarGenerations] = useState([]);
  const [carSeries, setCarSeries] = useState([]);
  const [carModifications, setCarModifications] = useState([]);

  // Simulated data - replace with actual API calls
  useEffect(() => {
    setCarTypes([
      { id: 1, name: 'Седан' },
      { id: 2, name: 'Внедорожник' },
      { id: 3, name: 'Хэтчбек' },
      { id: 4, name: 'Универсал' },
      { id: 5, name: 'Купе' }
    ]);

    // Load appropriate marks if type is selected
    if (values.type_id) {
      setCarMarks([
        { id: 1, name: 'Toyota' },
        { id: 2, name: 'BMW' },
        { id: 3, name: 'Mercedes' },
        { id: 4, name: 'Audi' }
      ]);
    }

    // Load models if mark is selected
    if (values.mark_id) {
      setCarModels([
        { id: 1, name: 'Camry' },
        { id: 2, name: 'Corolla' },
        { id: 3, name: 'RAV4' }
      ]);
    }

    // Load generations if model is selected
    if (values.model_id) {
      setCarGenerations([
        { id: 1, name: 'XV70', yearBegin: 2017, yearEnd: 2021 },
        { id: 2, name: 'XV60', yearBegin: 2012, yearEnd: 2017 },
        { id: 3, name: 'XV50', yearBegin: 2011, yearEnd: 2014 }
      ]);
    }
  }, [values.type_id, values.mark_id, values.model_id]);

  const handleChange = (field, value) => {
    // Reset dependent fields when parent changes
    let updatedValues = { ...values, [field]: value };
    
    if (field === 'type_id') {
      updatedValues = {
        type_id: value,
        mark_id: null,
        model_id: null,
        generation_id: null,
        serie_id: null,
        modification_id: null
      };
    } else if (field === 'mark_id') {
      updatedValues = {
        ...updatedValues,
        model_id: null,
        generation_id: null,
        serie_id: null,
        modification_id: null
      };
    } else if (field === 'model_id') {
      updatedValues = {
        ...updatedValues,
        generation_id: null,
        serie_id: null,
        modification_id: null
      };
    } else if (field === 'generation_id') {
      updatedValues = {
        ...updatedValues,
        serie_id: null,
        modification_id: null
      };
    } else if (field === 'serie_id') {
      updatedValues = {
        ...updatedValues,
        modification_id: null
      };
    }
    
    onChange(updatedValues);
  };

  // Helper to get item by ID from list
  const getItemById = (list, id) => {
    return list.find(item => item.id == id) || null;
  };

  // Current selected values
  const selectedType = getItemById(carTypes, values.type_id);
  const selectedMark = getItemById(carMarks, values.mark_id);
  const selectedModel = getItemById(carModels, values.model_id);
  const selectedGeneration = getItemById(carGenerations, values.generation_id);
  const selectedSerie = getItemById(carSeries, values.serie_id);
  const selectedModification = getItemById(carModifications, values.modification_id);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg flex items-center gap-2">
        <Car className="w-5 h-5" />
        Параметры автомобиля
      </h3>
      
      <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-200">
        {/* Car Type */}
        <div className="p-3 bg-white">
          <label className="block text-sm font-medium mb-2">Тип кузова</label>
          <select 
            value={values.type_id || ''}
            onChange={(e) => handleChange('type_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите тип кузова</option>
            {carTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Car Mark */}
        <div className={`p-3 bg-white ${!values.type_id ? 'opacity-60' : ''}`}>
          <label className="block text-sm font-medium mb-2">Марка</label>
          <select 
            value={values.mark_id || ''}
            onChange={(e) => handleChange('mark_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!values.type_id}
          >
            <option value="">Выберите марку</option>
            {carMarks.map(mark => (
              <option key={mark.id} value={mark.id}>{mark.name}</option>
            ))}
          </select>
        </div>

        {/* Car Model */}
        <div className={`p-3 bg-white ${!values.mark_id ? 'opacity-60' : ''}`}>
          <label className="block text-sm font-medium mb-2">Модель</label>
          <select 
            value={values.model_id || ''}
            onChange={(e) => handleChange('model_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!values.mark_id}
          >
            <option value="">Выберите модель</option>
            {carModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>

        {/* Car Generation */}
        <div className={`p-3 bg-white ${!values.model_id ? 'opacity-60' : ''}`}>
          <label className="block text-sm font-medium mb-2">Поколение</label>
          <select 
            value={values.generation_id || ''}
            onChange={(e) => handleChange('generation_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!values.model_id}
          >
            <option value="">Выберите поколение</option>
            {carGenerations.map(gen => (
              <option key={gen.id} value={gen.id}>
                {gen.name} {gen.yearBegin && `${gen.yearBegin}`} {gen.yearEnd && gen.yearBegin && '- '} {gen.yearEnd && `${gen.yearEnd}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Group search fields by group name
const groupSearchFields = (searchFields) => {
  const groups = {};
  const noGroup = [];

  searchFields.forEach(field => {
    if (field.groupName) {
      if (!groups[field.groupName]) {
        groups[field.groupName] = [];
      }
      groups[field.groupName].push(field);
    } else {
      noGroup.push(field);
    }
  });

  return { groups, noGroup };
};

const ProductsFilterPage = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = useCategoriesTree();
  const [regions, setRegions] = useState([
    { id: 1, name: 'Бишкек' },
    { id: 2, name: 'Чуйская область' },
    { id: 3, name: 'Ыссык-Кульская область' },
    { id: 4, name: 'Нарынская область' }
  ]);
  
  const [filters, setFilters] = useState({
    searchText: '',
    priceFrom: '',
    priceTo: '',
    hasPhoto: false,
    hasVideo: false,
    category: null,
    sortBy: 'newest',
    customAttributes: {},
    carAttributes: {},
    regionId: null,
    currencyId: null
  });

  const [resultsCount, setResultsCount] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Get category kind
  const getCategoryKind = (category) => {
    // Simplified version - in real app should come from backend
    if (!category) return CategoryKind.OTHER;
    
    const name = category.name.toLowerCase();
    if (name.includes('авто') || name.includes('машин')) return CategoryKind.CARS;
    if (name.includes('недвиж') || name.includes('квартир')) return CategoryKind.REALTY;
    if (name.includes('работа') || name.includes('вакан')) return CategoryKind.JOBS;
    if (name.includes('услуг')) return CategoryKind.SERVICES;
    if (name.includes('электрон')) return CategoryKind.ELECTRONICS;
    if (name.includes('одежд') || name.includes('обув')) return CategoryKind.CLOTHINGS;
    
    return CategoryKind.OTHER;
  };

  // Simulate category search fields based on category kind
  const getCategorySearchFields = (category) => {
    if (!category) return [];
    
    const kind = getCategoryKind(category);
    
    switch (kind) {
      case CategoryKind.CARS:
        return [
          {
            type: 'select',
            name: 'transmission',
            label: 'Коробка передач',
            placeholder: 'Выберите тип КПП',
            options: ['Механическая', 'Автоматическая', 'Роботизированная', 'Вариатор'],
            groupName: 'Основное'
          },
          {
            type: 'select',
            name: 'fuel',
            label: 'Тип топлива',
            placeholder: 'Выберите тип топлива',
            options: ['Бензин', 'Дизель', 'Электро', 'Гибрид', 'Газ'],
            groupName: 'Основное'
          },
          {
            type: 'number',
            name: 'year',
            label: 'Год выпуска',
            placeholder: 'Введите год',
            groupName: 'Основное'
          },
          {
            type: 'number',
            name: 'mileage',
            label: 'Пробег (км)',
            placeholder: 'Введите пробег',
            groupName: 'Состояние'
          },
          {
            type: 'boolean',
            name: 'is_cleared',
            label: 'Растаможен',
            groupName: 'Состояние'
          }
        ];
      case CategoryKind.REALTY:
        return [
          {
            type: 'select',
            name: 'property_type',
            label: 'Тип недвижимости',
            options: ['Квартира', 'Дом', 'Участок', 'Коммерческая недвижимость'],
            groupName: 'Основное'
          },
          {
            type: 'number',
            name: 'rooms',
            label: 'Количество комнат',
            placeholder: 'Укажите количество комнат',
            groupName: 'Основное'
          },
          {
            type: 'number',
            name: 'area',
            label: 'Площадь (м²)',
            placeholder: 'Укажите площадь',
            groupName: 'Основное'
          },
          {
            type: 'select',
            name: 'condition',
            label: 'Состояние',
            options: ['Евроремонт', 'Хорошее', 'Среднее', 'Требует ремонта'],
            groupName: 'Состояние'
          }
        ];
      case CategoryKind.JOBS:
        return [
          {
            type: 'select',
            name: 'employment_type',
            label: 'Тип занятости',
            options: ['Полная', 'Частичная', 'Проектная', 'Стажировка'],
            groupName: 'Условия'
          },
          {
            type: 'select',
            name: 'experience',
            label: 'Опыт работы',
            options: ['Без опыта', '1-3 года', '3-5 лет', 'Более 5 лет'],
            groupName: 'Условия'
          }
        ];
      default:
        // Default fields for other categories
        return category.searchFields || [];
    }
  };

  // Get category-specific search fields
  const categorySearchFields = selectedCategory ? getCategorySearchFields(selectedCategory) : [];
  const groupedSearchFields = groupSearchFields(categorySearchFields);
  
  // Determine if category is a car category
  const isCarCategory = selectedCategory && getCategoryKind(selectedCategory) === CategoryKind.CARS;
  const categoryKind = selectedCategory ? getCategoryKind(selectedCategory) : null;

  // Get currency list
  const currencies = [
    { id: 1, name: 'USD', symbol: '$' },
    { id: 2, name: 'KGS', symbol: 'сом' },
    { id: 3, name: 'RUB', symbol: '₽' }
  ];

  const { products, loading } = useProducts({
    ...filters,
    categories: filters.category ? [filters.category].join(',') : '',
    has_photo: filters.hasPhoto,
    has_video: filters.hasVideo,
    price_from: filters.priceFrom || null,
    price_to: filters.priceTo || null,
    sort: filters.sortBy,
    custom_attributes: filters.customAttributes,
    car_attributes: filters.carAttributes,
    region_id: filters.regionId,
    currency_id: filters.currencyId
  });

  // Simulate fetching results count
  useEffect(() => {
    const fetchResultsCount = async () => {
      setIsLoadingResults(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setResultsCount(Math.floor(Math.random() * 1000) + 1);
      setIsLoadingResults(false);
    };

    fetchResultsCount();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterChange('category', category.id);
    // Reset category-specific filters
    handleFilterChange('customAttributes', {});
    handleFilterChange('carAttributes', {});
  };

  const handleCustomAttributeChange = (name, value) => {
    handleFilterChange('customAttributes', {
      ...filters.customAttributes,
      [name]: value
    });
  };

  const handleCarAttributesChange = (values) => {
    handleFilterChange('carAttributes', values);
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      priceFrom: '',
      priceTo: '',
      hasPhoto: false,
      hasVideo: false,
      category: null,
      sortBy: 'newest',
      customAttributes: {},
      carAttributes: {},
      regionId: null,
      currencyId: null
    });
    setSelectedCategory(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.category) count++;
    if (filters.hasPhoto) count++;
    if (filters.hasVideo) count++;
    if (filters.priceFrom || filters.priceTo) count++;
    if (filters.regionId) count++;
    if (filters.currencyId) count++;
    count += Object.keys(filters.customAttributes).length;
    count += Object.keys(filters.carAttributes).length;
    return count;
  };

  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'low_price', label: 'Сначала дешевые' },
    { value: 'high_price', label: 'Сначала дорогие' },
    { value: 'views', label: 'По популярности' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск объявлений..."
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Фильтры</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pb-2">
              {filters.searchText && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Search className="w-4 h-4" />
                  {filters.searchText}
                  <button onClick={() => handleFilterChange('searchText', '')}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {filters.category && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {categories.find(c => c.id === filters.category)?.name}
                  <button onClick={() => {
                    handleFilterChange('category', null);
                    setSelectedCategory(null);
                  }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {filters.regionId && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4" />
                  {regions.find(r => r.id === filters.regionId)?.name}
                  <button onClick={() => handleFilterChange('regionId', null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {(filters.priceFrom || filters.priceTo) && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <DollarSign className="w-4 h-4" />
                  {filters.priceFrom || '0'} - {filters.priceTo || '∞'}
                  <button onClick={() => {
                    handleFilterChange('priceFrom', '');
                    handleFilterChange('priceTo', '');
                  }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {filters.hasPhoto && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  С фото
                  <button onClick={() => handleFilterChange('hasPhoto', false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {filters.hasVideo && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Video className="w-4 h-4" />
                  С видео
                  <button onClick={() => handleFilterChange('hasVideo', false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {Object.keys(filters.customAttributes).length > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {Object.keys(filters.customAttributes).length} параметров
                  <button onClick={() => handleFilterChange('customAttributes', {})}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {Object.keys(filters.carAttributes).length > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Car className="w-4 h-4" />
                  {Object.keys(filters.carAttributes).length} параметров авто
                  <button onClick={() => handleFilterChange('carAttributes', {})}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`md:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Show Results Button - Visible on Mobile */}
            <div className="sticky top-0 md:hidden bg-blue-500 text-white rounded-lg p-3 mb-4 shadow-md">
              <button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => setShowFilters(false)}
                disabled={!resultsCount}
              >
                <span>Показать результаты</span>
                {resultsCount && <span className="font-bold">: {resultsCount}</span>}
                {isLoadingResults && (
                  <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Сбросить все
                </button>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Категория</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory?.id === category.id
                          ? 'bg-blue-50 text-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Регион</h3>
                <select
                  value={filters.regionId || ''}
                  onChange={(e) => handleFilterChange('regionId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите регион</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Section */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Цена</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.priceFrom}
                      onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.priceTo}
                      onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filters.currencyId || ''}
                    onChange={(e) => handleFilterChange('currencyId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Валюта</option>
                    {currencies.map(currency => (
                      <option key={currency.id} value={currency.id}>{currency.name} ({currency.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media Filters */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Медиа</h3>
                <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Только с фото</span>
                    <input
                      type="checkbox"
                      checked={filters.hasPhoto}
                      onChange={(e) => handleFilterChange('hasPhoto', e.target.checked)}
                      className="rounded border-gray-300 w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Только с видео</span>
                    <input
                      type="checkbox"
                      checked={filters.hasVideo}
                      onChange={(e) => handleFilterChange('hasVideo', e.target.checked)}
                      className="rounded border-gray-300 w-5 h-5"
                    />
                  </label>
                </div>
              </div>

              {/* Car-specific Filters */}
              {isCarCategory && (
                <div className="mb-6">
                  <CarFilters
                    values={filters.carAttributes}
                    onChange={handleCarAttributesChange}
                  />
                </div>
              )}

              {/* Category-specific Search Fields by Groups */}
              {Object.entries(groupedSearchFields.groups).length > 0 && (
                <>
                  {Object.entries(groupedSearchFields.groups).map(([groupName, fields]) => (
                    <div key={groupName} className="mb-6">
                      <h3 className="font-medium mb-2">{groupName}</h3>
                      <div className="space-y-2">
                        {fields.map(field => (
                          <CategorySearchField
                            key={field.name}
                            field={field}
                            value={filters.customAttributes[field.name]}
                            onChange={handleCustomAttributeChange}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Non-grouped Search Fields */}
              {groupedSearchFields.noGroup.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Дополнительные параметры</h3>
                  <div className="space-y-2">
                    {groupedSearchFields.noGroup.map(field => (
                      <CategorySearchField
                        key={field.name}
                        field={field}
                        value={filters.customAttributes[field.name]}
                        onChange={handleCustomAttributeChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count - Desktop View */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {loading || isLoadingResults ? (
                  <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <>
                    {resultsCount ? `Найдено объявлений: ${resultsCount}` : 'Объявления не найдены'}
                  </>
                )}
              </h2>
              
              {selectedCategory && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span>
                    Категория: <span className="font-medium">{selectedCategory.name}</span>
                  </span>
                  {categoryKind && (
                    <span className="inline-flex items-center ml-2">
                      {CategoryKindIcon[categoryKind]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(null).map((_, i) => (
                  <ProductItemSkeleton key={i} />
                ))}
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <Search className="w-16 h-16 text-gray-300" />
                  <h3 className="text-xl font-medium text-gray-700">
                    По вашему запросу ничего не найдено
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Попробуйте изменить параметры фильтрации или выбрать другую категорию
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}

            {/* Pagination or Load More */}
            {products?.length > 0 && !loading && (
              <div className="mt-8 flex justify-center">
                <button 
                  className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Загрузить ещё
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterPage;