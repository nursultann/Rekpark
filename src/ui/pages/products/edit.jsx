import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import useEditProductQuery from "../../../hooks/product/useEditProductQuery";
import ProductForm from "./contents/product_form";
import { ChevronRight, AlertTriangle, Info, ArrowLeft } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    product,
    loading,
    error,
    progress,
    updateProduct,
    deleteProduct,
    updateStatus
  } = useEditProductQuery(id);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Format product data for the form
  const getInitialValues = () => {
    if (!product) return {};
    
    // Format phones array
    const phones = product.phones || [];
    
    // Format custom attribute values
    const custom_attribute_values = product.custom_attribute_values?.map(attr => ({
      attribute_id: attr.custom_attribute_id,
      attribute_title: attr.custom_attribute?.title || "Атрибут",
      required: attr.custom_attribute?.is_required || false,
      value: attr.value || ""
    })) || [];
    
    return {
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      currency_id: product.currency_id?.toString() || "",
      category_id: product.category_id?.toString() || "",
      region_id: product.region_id?.toString() || "",
      city_id: product.city_id?.toString() || "",
      district: product.district || "",
      location: product.location || "",
      phones: phones.length ? phones : [""],
      video: product.video || "",
      custom_attribute_values,
      // Media is handled separately in the form component
      media: product.media || []
    };
  };

  const handleSubmit = async (formData) => {
    try {
      const product = await updateProduct(formData);
      setUpdatedProduct(product);
      setShowSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Navigate to product page after a short delay
      setTimeout(() => {
        navigate(`/products/${product.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      // Error is handled by the hook and will be displayed in the form
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteProduct();
      navigate("/profile/list", { 
        state: { message: "Объявление успешно удалено" } 
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError("Не удалось удалить объявление. Пожалуйста, попробуйте позже.");
    } finally {
      setIsDeleting(false);
    }
  };

  // If product status is not active, show a message
  const getStatusMessage = () => {
    if (!product) return null;
    
    switch(product.status) {
      case 'moderation':
        return {
          title: "Объявление на модерации",
          description: "Ваше объявление находится на модерации и скоро будет опубликовано.",
          color: "yellow"
        };
      case 'rejected':
        return {
          title: "Объявление отклонено",
          description: "Ваше объявление было отклонено модератором. Проверьте причину отказа и внесите необходимые изменения.",
          color: "red"
        };
      case 'inactive':
        return {
          title: "Объявление неактивно",
          description: "Ваше объявление в настоящее время неактивно. Активируйте его, чтобы оно отображалось в поиске.",
          color: "gray"
        };
      case 'disabled':
        return {
          title: "Объявление отключено",
          description: "Ваше объявление было отключено администратором.",
          color: "red"
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  if (loading && !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 w-3/4 rounded animate-pulse"></div>
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки объявления</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/profile/list")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Вернуться к списку объявлений
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Объявление не найдено</h2>
          <p className="text-gray-600 mb-6">Объявление не существует или было удалено.</p>
          <button
            onClick={() => navigate("/profile/list")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Мои объявления
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Редактирование объявления | RekPark</title>
      </Helmet>
      
      {/* Back button */}
      <div className="mb-4">
        <button 
          onClick={() => navigate(`/products/${id}`)}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Вернуться к объявлению
        </button>
      </div>
      
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Редактирование объявления
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-primary">Главная</a>
          <ChevronRight className="mx-1 w-4 h-4" />
          <a href="/profile/list" className="hover:text-primary">Мои объявления</a>
          <ChevronRight className="mx-1 w-4 h-4" />
          <span>Редактирование</span>
        </div>
      </div>
      
      {/* Status message */}
      {statusMessage && (
        <div className={`bg-${statusMessage.color}-50 border border-${statusMessage.color}-200 text-${statusMessage.color}-700 rounded-lg p-4 mb-6`}>
          <div className="flex items-start">
            <Info className="w-5 h-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">{statusMessage.title}</p>
              <p>{statusMessage.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {showSuccess && updatedProduct && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2" />
            <div>
              <p className="font-medium">Объявление успешно обновлено!</p>
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
      
      {/* Product form */}
      <ProductForm
        initialValues={getInitialValues()}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitError={error}
        buttonText="Сохранить изменения"
        isEditMode={true}
        innitialCategory={product.category}
      />
      
      {/* Delete product section */}
      <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-700 mb-3">Удаление объявления</h3>
        <p className="text-red-600 mb-4">
          После удаления объявление невозможно будет восстановить. Эта операция необратима.
        </p>
        
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            Удалить объявление
          </button>
        ) : (
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <p className="font-medium text-gray-900 mb-3">
              Вы уверены, что хотите удалить это объявление?
            </p>
            
            {deleteError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
                {deleteError}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Удаление...
                  </>
                ) : (
                  "Да, удалить"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;