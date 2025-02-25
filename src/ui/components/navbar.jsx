import React, { useState, useRef } from "react";
import {
  User,
  Search,
  X,
  Grip,
  Bell,
  Plus,
  ChevronDown
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
  const navigate = useNavigate();

  const categories = useCategoriesTree();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery) {
      navigate(`/filter?q=${searchQuery}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link className="flex items-center" to="/">
          {/* Replace with your own logo */}
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
          className="shadow-xl "
        >
          <button
            id="catalog-menu-button"
            onClick={() => setCatalogMenuOpen((prev) => !prev)}
            className="flex items-center  px-3 py-2 rounded-lg transition-colors border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            <Grip className="w-5 h-5 mr-2 text-gray-600" />
            <span>Каталог</span>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-600" />
          </button>
        </CustomTooltip>

        {/* Search Field */}
        <div className="flex-1">
          <div className="relative w-full">
            
          </div>
        </div>

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
            <button className="flex flex-row justify-content-center align-items-center gap-2  px-3 xs:px-1 xs:gap-0 py-2 rounded-2xl border border-zinc-100">
              <Plus className="w-5 h-5" />
              <div className="d-none d-md-block">
                  Разместить объявление
                </div>
            </button>
          </div>
        </div>
    </header>
  );
};

export default Navbar;
