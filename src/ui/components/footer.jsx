import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Share2,
  Building,
  Link,
  Info,
  FileText,
  Briefcase,
  HelpCircle,
  PhoneCall,
  Share,
  Instagram,
  Facebook,
  Copyright,
  Shield,
  FileCheck,
  Contact,
  Smartphone,
  Apple,
  Play
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-4 sm:mt-8">
  <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
    {/* Main Grid */}
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      
      {/* Company Info */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Building className="w-4 h-4 sm:w-5 sm:h-5" />
          О компании
        </h3>
        <p className="text-xs sm:text-sm text-gray-200">
          RekPark - ведущая платформа для размещения объявлений в Кыргызстане. Мы соединяем продавцов и покупателей, делая процесс покупки и продажи простым и безопасным.
        </p>
      </div>

      {/* Quick Links */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Link className="w-4 h-4 sm:w-5 sm:h-5" />
          Быстрые ссылки
        </h3>
        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
          <li>
            <a href="/about" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors flex items-center gap-2">
              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              О нас
            </a>
          </li>
          <li>
            <a href="/agreement" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors flex items-center gap-2">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              Пользовательское соглашение
            </a>
          </li>
          <li>
            <a href="/business" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors flex items-center gap-2">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              Для бизнеса
            </a>
          </li>
          <li>
            <a href="/help" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors flex items-center gap-2">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              Помощь
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
          Контакты
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <a href="tel:+996123456789" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors">
              +996 (123) 456-789
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            <a href="mailto:info@rekpark.kg" className="text-xs sm:text-sm text-gray-200 hover:text-white transition-colors">
              info@rekpark.kg
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm text-gray-200">г. Бишкек, ул. Примерная 123</span>
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Share className="w-4 h-4 sm:w-5 sm:h-5" />
          Мы в соцсетях
        </h3>
        <div className="flex gap-3">
          <a href="https://rekpark.kg" target="_blank" rel="noopener noreferrer" 
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="https://rekpark.kg/messages" target="_blank" rel="noopener noreferrer"
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="https://rekpark.kg/share" target="_blank" rel="noopener noreferrer"
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
            className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white border-opacity-10 mt-6 sm:mt-8 pt-6 sm:pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
          <Copyright className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />
          {new Date().getFullYear()} RekPark. Все права защищены.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-300">
          <a href="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            Конфиденциальность
          </a>
          <a href="/terms" className="hover:text-white transition-colors flex items-center gap-1">
            <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
            Условия использования
          </a>
          <a href="/contacts" className="hover:text-white transition-colors flex items-center gap-1">
            <Contact className="w-3 h-3 sm:w-4 sm:h-4" />
            Контакты
          </a>
        </div>
      </div>
    </div>

    {/* Mobile App Bar */}
    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
      <p className="text-xs sm:text-sm text-gray-300 mb-4 flex items-center justify-center gap-2">
        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
        Скачайте наше мобильное приложение
      </p>
      <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4">
        <button className="bg-white bg-opacity-10 hover:bg-opacity-20 transition-all px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2">
          <Apple className="w-4 h-4 sm:w-5 sm:h-5" />
          App Store
        </button>
        <button className="bg-white bg-opacity-10 hover:bg-opacity-20 transition-all px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2">
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          Google Play
        </button>
      </div>
    </div>
  </div>
</footer>
  );
};

export default Footer;