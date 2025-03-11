import React, { useState, useRef } from "react";
import {
  User,
  Search,
  X,
  Grip,
  Bell,
  Plus,
  ChevronDown,
  Menu // Added for mobile menu
} from "lucide-react";
import logo from "../../dist/img/logo.png";
import { Tooltip } from 'react-tooltip';
import CatalogMenu from "./catalog_menu";
import CustomTooltip from "./custom_tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useCategoriesTree } from "../../hooks/category";

const Navbar = ({ onSignIn, onProfile }) => {
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = useCategoriesTree();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/filter`);
  };

  const handleAddProduct = () => {
    navigate("/products/create");
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Desktop Navbar */}
      <div className="container mx-auto px-4 h-16 flex items-center gap-4 max-lg:hidden">
        {/* Logo */}
        <Link className="flex items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-8 object-contain"
          />
        </Link>

        {/* Catalog Button */}
        <CustomTooltip
          trigger="click"
          content={
            <CatalogMenu
              handleSelect={(categoryId) => {
                navigate(`/filter?category=${categoryId}`);
                setCatalogMenuOpen(false);
              }}
            />
          }
          position="bottom"
          maxWidth="80%"
          maxHeight="80vh"
          isOpen={catalogMenuOpen}
          showArrow={true}
          onClose={() => setCatalogMenuOpen(false)}
          className="shadow-xl"
        >
          <button
            id="catalog-menu-button"
            onClick={() => setCatalogMenuOpen((prev) => !prev)}
            className="flex items-center px-3 py-2 rounded-lg transition-colors border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            <Grip className="w-5 h-5 mr-2 text-gray-600" />
            <span>Каталог</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
          </button>
        </CustomTooltip>

        {/* Search Field */}
        <div className="flex-1">
          <div className="relative w-full">
            <form onSubmit={handleSearch} className="flex">
              <input 
                type="text" 
                placeholder="Поиск" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSearch}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <button 
            onClick={onProfile}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <User className="w-6 h-6" />
          </button>
          <button 
            onClick={handleAddProduct}
            className="flex flex-row justify-content-center align-items-center gap-2 px-3 py-2 rounded-2xl border border-zinc-100"
          >
            <Plus className="w-5 h-5" />
            <div className="text-sm max-w-xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Разместить объявление
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        {/* Mobile Top Bar */}
        <div className="container mx-auto px-1 h-16 flex items-center justify-between max-w-none">
          <Link to="/" className="flex items-start">
            <img
              src={logo}
              alt="Logo"
              className="h-8 object-contain max-w-none"
            />
          </Link>
          
          <div className="flex items-start space-x-1">
            <button 
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto max-w-none w-full">
            <div className="container mx-auto px-0 py-4 w-full">
              {/* Mobile Menu Close Button */}
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-8 object-contain"
                  />
                </Link>
                <button 
                  onClick={toggleMobileMenu}
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-4">
                {/* Catalog Button */}
                <CustomTooltip
                  trigger="click"
                  content={
                    <CatalogMenu
                      handleSelect={(categoryId) => {
                        navigate(`/filter?category=${categoryId}`);
                        setCatalogMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    />
                  }
                  position="bottom"
                  maxWidth="90%"
                  maxHeight="80vh"
                  isOpen={catalogMenuOpen}
                  showArrow={true}
                  onClose={() => setCatalogMenuOpen(false)}
                  className="shadow-xl w-full"
                >
                  <button
                    id="catalog-menu-button-mobile"
                    onClick={() => setCatalogMenuOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      <Grip className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Каталог</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </CustomTooltip>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex">
                  <input 
                    type="text" 
                    placeholder="Поиск" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Mobile Menu Action Buttons */}
                <div className="space-y-4 mt-4">
                  <button 
                    onClick={() => {
                      onProfile();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Профиль</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleAddProduct();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Разместить объявление</span>
                    </div>
                  </button>
                  
                  <button 
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Уведомления</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;