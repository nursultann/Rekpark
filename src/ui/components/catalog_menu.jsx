import React, { useState, useEffect } from "react";
import { useCategoriesTree } from "../../hooks/category";
import { ChevronRight, FolderOpen, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MacOSColumnView = ({ categories, onSelect, onNavigate, selectedPath = [] }) => {
  // Track selections at each level
  const [selections, setSelections] = useState(selectedPath);
  
  // Get categories for each level based on selections
  const getCategoriesForLevel = (level) => {
    if (level === 0) return categories;
    
    if (level > 0 && selections.length >= level) {
      let currentCategories = categories;
      
      // Navigate down the tree based on selections
      for (let i = 0; i < level; i++) {
        const selectedCategory = currentCategories.find(c => c.id === selections[i]);
        if (!selectedCategory) return [];
        currentCategories = selectedCategory?.children || [];
      }
      
      return currentCategories;
    }
    
    return [];
  };
  
  // Handle selection at a specific level
  const handleSelect = (level, categoryId) => {
    // Truncate selections array to the current level and add new selection
    const newSelections = [...selections.slice(0, level), categoryId];
    setSelections(newSelections);
    
    // Find the selected category
    let selectedCategory = null;
    let currentCategories = categories;
    
    for (let i = 0; i < newSelections.length; i++) {
      selectedCategory = currentCategories.find(c => c.id === newSelections[i]);
      if (!selectedCategory) break;
      
      if (i === newSelections.length - 1) {
        // This is the category we just selected
        if (onSelect && selectedCategory) {
          onSelect(selectedCategory);
        }
      }
      
      currentCategories = selectedCategory?.children || [];
    }
  };
  
  // Determine how many columns to show (maximum 3)
  const columnsToShow = Math.min(selections.length + 1, 3);
  
  return (
    <div className="flex h-96 border rounded-lg overflow-hidden">
      {/* Render columns */}
      {[...Array(columnsToShow)].map((_, level) => {
        const levelCategories = getCategoriesForLevel(level);
        const selectedId = selections[level];
        
        return (
          <div 
            key={level}
            className="w-64 border-r border-gray-100 h-full overflow-y-auto"
            style={{ backgroundColor: level % 2 === 0 ? '#f9f9f9' : '#fff' }}
          >
            {levelCategories.length > 0 ? (
              <ul className="py-1">
                {levelCategories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleSelect(level, category.id)}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between ${
                        selectedId === category.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {selectedId === category.id ? (
                          <FolderOpen className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="truncate">{category.name}</span>
                      </div>
                      {category.children?.length > 0 && (
                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Нет подкатегорий
              </div>
            )}
          </div>
        );
      })}
      
      {/* Preview pane - show details of the last selected category */}
      {selections.length > 0 && (
        <div className="flex-1 p-4 bg-white overflow-y-auto">
          {(() => {
            // Find the last selected category
            let selectedCategory = null;
            let currentCategories = categories;
            
            for (let i = 0; i < selections.length; i++) {
              selectedCategory = currentCategories.find(c => c.id === selections[i]);
              if (!selectedCategory) break;
              currentCategories = selectedCategory?.children || [];
            }
            
            if (selectedCategory) {
              return (
                <div>
                  <h3 className="font-medium text-lg mb-2">{selectedCategory.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedCategory.description || 'Категория товаров и услуг'}
                  </p>
                  
                  {selectedCategory.children?.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Подкатегории</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCategory.children.slice(0, 6).map(subcat => (
                          <button
                            key={subcat.id}
                            onClick={() => onNavigate && onNavigate(subcat.id)}
                            className="text-sm text-blue-500 hover:text-blue-600 truncate text-left"
                          >
                            {subcat.name}
                          </button>
                        ))}
                        {selectedCategory.children.length > 6 && (
                          <span className="text-sm text-gray-500">
                            +{selectedCategory.children.length - 6} ещё
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Нет подкатегорий
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button 
                      onClick={() => onNavigate && onNavigate(selectedCategory.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm w-full"
                    >
                      Перейти в категорию
                    </button>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="text-sm text-gray-400 flex items-center justify-center h-full">
                Выберите категорию
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default function CatalogMenu({
    handleSelect,
}) {
  const categories = useCategoriesTree();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const handleNavigate = (categoryId) => {
    handleSelect(categoryId);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-white">
        <p className="text-gray-400">Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full min-w-[600px]">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
        <h2 className="font-medium text-gray-700">Каталог товаров и услуг</h2>
      </div>
      
      <MacOSColumnView 
        categories={categories} 
        onSelect={setSelectedCategory}
        onNavigate={handleNavigate}
      />
    </div>
  );
}