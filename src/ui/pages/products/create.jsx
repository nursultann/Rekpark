import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import useCreateProductQuery from "../../../hooks/product/useCreateProductQuery";
import ProductForm from "./contents/product_form";
import { ChevronRight, Info } from "lucide-react";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const {
    createProduct,
    loading,
    error,
    progress
  } = useCreateProductQuery();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const product = await createProduct(formData);
      setCreatedProduct(product);
      setShowSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Navigate to product page after a short delay
      setTimeout(() => {
        navigate(`/products/${product.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      // Error is handled by the hook and will be displayed in the form
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Создать объявление | RekPark</title>
      </Helmet>
      
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Создать объявление</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary">Главная</a>
          <ChevronRight className="mx-1 w-4 h-4" />
          <span>Создать объявление</span>
        </div>
      </div>
      
      {/* Success message */}
      {showSuccess && createdProduct && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2" />
            <div>
              <p className="font-medium">Объявление успешно создано!</p>
              <p>Сейчас вы будете перенаправлены на страницу объявления.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress bar for uploads */}
      {progress > 0 && progress < 100 && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Загрузка изображений</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Советы по созданию объявления:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Используйте информативный заголовок</li>
              <li>Подробно опишите товар или услугу</li>
              <li>Добавьте качественные фотографии</li>
              <li>Укажите точную цену и контактные данные</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Product form */}
      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitError={error}
        buttonText="Создать объявление"
      />
    </div>
  );
};

export default CreateProductPage;