import React, { useState, useEffect, useRef } from "react";
import { useCategoriesQuery } from "../../../hooks/category";
import { ChevronRight, X, FolderIcon, Check, Search } from "lucide-react";
import { filterCategoriesByParentIdRecursive } from "../../../helpers/functions";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";

const CategoryBreadcrumb = ({ path, onNavigate }) => {
  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap py-2 px-1">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <button
            onClick={() => onNavigate(item)}
            className={`hover:text-primary transition-colors ${
              index === path.length - 1 ? "font-medium text-primary" : "text-gray-600"
            }`}
          >
            {item.name}
          </button>
          {index < path.length - 1 && (
            <ChevronRight className="mx-1 w-4 h-4 text-gray-400" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CategoryColumn = ({ 
  categories, 
  selectedId, 
  onSelect, 
  searchQuery = "" 
}) => {
  const listRef = useRef(null);
  
  // Filter categories by search query if provided
  const filteredCategories = searchQuery
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  // Scroll to selected item when component mounts or selection changes
  useEffect(() => {
    if (listRef.current && selectedId) {
      const selectedElement = listRef.current.querySelector(`[data-id="${selectedId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedId, categories]);

  return (
    <div 
      ref={listRef}
      className="h-full overflow-y-auto border-r border-gray-200"
    >
      {filteredCategories.length > 0 ? (
        <ul className="py-1">
          {filteredCategories.map(category => (
            <li key={category.id}>
              <button
                data-id={category.id}
                onClick={() => onSelect(category)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 rounded-none ${
                  selectedId === category.id ? "bg-blue-50 text-primary" : ""
                }`}
              >
                <div className="flex items-center">
                  <FolderIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{category.name}</span>
                </div>
                {category.children?.length > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-4">
          {searchQuery ? "No matching categories" : "No subcategories"}
        </div>
      )}
    </div>
  );
};

const SelectCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialSelectedId = null 
}) => {
  const modalRef = useRef(null);
  const { categories, loading } = useCategoriesQuery();
  
  const [selectedPath, setSelectedPath] = useState([]);
  const [currentLevel, setCurrentLevel] = useState([]);
  const [nextLevel, setNextLevel] = useState([]);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  
  // Close modal when clicking outside
  useOutsideAlerter(modalRef, () => {
    if (isOpen) onClose();
  });

  // Initialize categories when loaded
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Flatten categories for search
      const flattenCategories = (cats, result = []) => {
        cats.forEach(cat => {
          result.push(cat);
          if (cat.children?.length) {
            flattenCategories(cat.children, result);
          }
        });
        return result;
      };
      
      setAllCategories(flattenCategories(categories));
      
      // Set root level categories
      const rootCategories = categories.filter(cat => !cat.parent_id);
      setCurrentLevel(rootCategories);
      
      // If initialSelectedId is provided, set up the path
      if (initialSelectedId) {
        const buildPath = (catId, cats) => {
          for (const cat of cats) {
            if (cat.id === catId) {
              return [cat];
            }
            if (cat.children?.length) {
              const path = buildPath(catId, cat.children);
              if (path.length) {
                return [cat, ...path];
              }
            }
          }
          return [];
        };
        
        const path = buildPath(initialSelectedId, categories);
        if (path.length) {
          setSelectedPath(path);
          setSelectedId(path[path.length - 1].id);
          
          // Set next level if the selected category has children
          const selected = path[path.length - 1];
          if (selected.children?.length) {
            setNextLevel(selected.children);
          } else {
            setNextLevel([]);
          }
          
          // Set current level to siblings of the selected category
          if (path.length > 1) {
            const parent = path[path.length - 2];
            setCurrentLevel(parent.children || []);
          } else {
            setCurrentLevel(rootCategories);
          }
        }
      }
    }
  }, [categories, initialSelectedId]);

  // Handle category selection
  const handleSelectCategory = (category) => {
    setSelectedId(category.id);
    
    // If selecting from search results, need to build proper path
    if (searchQuery) {
      const buildPath = (cat, result = []) => {
        if (!cat.parent_id) {
          return [cat];
        }
        
        const parent = allCategories.find(c => c.id === cat.parent_id);
        if (parent) {
          return [...buildPath(parent), cat];
        }
        
        return [cat];
      };
      
      const path = buildPath(category);
      setSelectedPath(path);
      
      // Set current level to siblings
      if (path.length > 1) {
        const parent = path[path.length - 2];
        const siblings = allCategories.filter(c => c.parent_id === parent.id);
        setCurrentLevel(siblings);
      } else {
        setCurrentLevel(categories.filter(c => !c.parent_id));
      }
    } else {
      // Handle normal navigation
      // Find the location in the path
      const pathIndex = selectedPath.findIndex(item => item.id === category.id);
      
      if (pathIndex >= 0) {
        // Clicking on a category in the path, go back to that level
        setSelectedPath(selectedPath.slice(0, pathIndex + 1));
      } else {
        // Add to path
        setSelectedPath([...selectedPath, category]);
      }
    }
    
    // Set children as next level
    if (category.children?.length) {
      setNextLevel(category.children);
    } else {
      setNextLevel([]);
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (category) => {
    const pathIndex = selectedPath.findIndex(item => item.id === category.id);
    if (pathIndex >= 0) {
      // Truncate path to this level
      const newPath = selectedPath.slice(0, pathIndex + 1);
      setSelectedPath(newPath);
      setSelectedId(category.id);
      
      // Set next level to children of selected category
      if (category.children?.length) {
        setNextLevel(category.children);
      } else {
        setNextLevel([]);
      }
      
      // If going to root, set current level to root categories
      if (pathIndex === 0) {
        setCurrentLevel(categories.filter(c => !c.parent_id));
      } else {
        // Otherwise set current level to siblings
        const parent = selectedPath[pathIndex - 1];
        setCurrentLevel(parent.children || []);
      }
    }
    
    // Clear search when navigating
    setSearchQuery("");
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle category confirmation
  const handleConfirm = () => {
    if (selectedId) {
      const selectedCategory = allCategories.find(cat => cat.id === selectedId);
      if (selectedCategory) {
        onSelect(selectedCategory);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col"
        style={{ height: '600px' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">Select Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search bar */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        {/* Breadcrumb */}
        {!searchQuery && (
          <div className="px-6 py-2 border-b border-gray-200">
            <CategoryBreadcrumb 
              path={selectedPath} 
              onNavigate={handleBreadcrumbClick} 
            />
          </div>
        )}
        
        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* First column - current level */}
            <div className="w-1/2 flex-shrink-0">
              <CategoryColumn
                categories={searchQuery ? allCategories : currentLevel}
                selectedId={selectedId}
                onSelect={handleSelectCategory}
                searchQuery={searchQuery}
              />
            </div>
            
            {/* Second column - next level (children) */}
            <div className="w-1/2 flex-shrink-0">
              {!searchQuery && (
                <CategoryColumn
                  categories={nextLevel}
                  selectedId={null}
                  onSelect={handleSelectCategory}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedId && (
              <div>
                Selected: <span className="font-medium text-gray-900">
                  {allCategories.find(cat => cat.id === selectedId)?.name}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {selectedId && <Check className="w-4 h-4 mr-1" />}
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryModal;