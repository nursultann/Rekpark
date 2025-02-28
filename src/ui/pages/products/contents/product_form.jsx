import React, { useState, useEffect } from "react";
import { useCategoriesQuery } from "../../../../hooks/category";
import DragAndDropUploader from "../../../components/drag_and_drop_uploader";
import TagsInput from "../../../components/tags_input";
import { ChevronDown, Info, X, Plus, Smartphone, MapPin } from "lucide-react";
import SelectCategoryModal from "../../../components/category/select_category_modal";
import { NewCustomAttributeField } from "../../../components/custom_components";
import useCurrencyQuery from "../../../../hooks/useCurrencyQuery";
import useRegionsQuery from "../../../../hooks/useRegionsQuery";
import CarAttributes from "../../../components/custom_attribute/car_attributes";

const ProductForm = ({
    initialValues = {},
    onSubmit,
    isSubmitting = false,
    submitError = null,
    buttonText = "Сохранить",
    isEditMode = false,
    innitialCategory = null
}) => {
    const {
        categories,
        loading: categoriesLoading,
        getSearchFields,
        getCategoryAttributes,
    } = useCategoriesQuery();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        currency_id: "1", // Default to KGS
        category_id: "",
        region_id: "",
        city_id: "",
        district: "",
        location: null, // Will store map coordinates as {latitude, longitude}
        address: "", // This will store the text address
        phones: [""],
        images: [],
        video: "",
        custom_attribute_values: [],
        car_attributes: [],
        ...initialValues
    });

    // UI state
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryFields, setCategoryFields] = useState([]);
    const [categoryAttributes, setCategoryAttributes] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [showErrorSummary, setShowErrorSummary] = useState(false);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const { regions, cities, selectRegion } = useRegionsQuery()

    const { currencies } = useCurrencyQuery()

    // Load initial images for edit mode
    useEffect(() => {
        if (isEditMode && initialValues.media && initialValues.media.length > 0) {
            setPreviewImages(
                initialValues.media.map(media => ({
                    id: media.id,
                    url: media.original_url,
                    isExisting: true
                }))
            );
        }
    }, [isEditMode, initialValues.media]);

    useEffect(() => {
        if (innitialCategory) {
            setSelectedCategory(innitialCategory)
            setFormData({
                ...formData,
                category_id: innitialCategory.id
            });
        }
    }, [innitialCategory])

    // Initialize 2GIS map
    useEffect(() => {
        if (!mapInitialized && typeof window !== 'undefined') {
            // Only import and initialize if we're in browser environment
            const DG = window.DG;
            if (DG) {
                DG.then(function () {
                    const defaultCoords = [42.876, 74.607]; // Default coordinates (Bishkek)
                    
                    // Use existing coordinates if available in formData
                    const initialCoords = formData.location 
                        ? [parseFloat(formData.location.latitude), parseFloat(formData.location.longitude)]
                        : defaultCoords;
                    
                    const mapInstance = DG.map('map-container', {
                        'center': initialCoords,
                        'zoom': 13
                    });
                    
                    const markerInstance = DG.marker(initialCoords, {
                        draggable: true
                    }).addTo(mapInstance);
                    
                    // When marker is dragged, update location
                    markerInstance.on('drag', function (e) {
                        let lat = e.target._latlng.lat.toFixed(6);
                        let lng = e.target._latlng.lng.toFixed(6);
                        setFormData(prev => ({
                            ...prev,
                            location: { latitude: lat, longitude: lng }
                        }));
                        
                        // Clear location error when user sets a location
                        if (errors.location) {
                            setErrors({
                                ...errors,
                                location: null
                            });
                        }
                    });
                    
                    setMap(mapInstance);
                    setMarker(markerInstance);
                    setMapInitialized(true);
                });
            }
        }
    }, [mapInitialized]);

    // Update category fields and attributes when category changes
    useEffect(() => {
        if (formData.category_id && categories?.length) {
            const category = selectedCategory || categories.find(cat => cat.id === formData.category_id);
            if (category) {
                // Get search fields and custom attributes
                const fields = getSearchFields(category);
                const attributes = getCategoryAttributes(category);

                setCategoryFields(fields || []);
                setCategoryAttributes(attributes || []);

                // Initialize custom attribute values if not already set
                if (attributes?.length) {
                    const currentAttrValues = formData.custom_attribute_values || [];
                    const newAttrValues = attributes.map(attr => {
                        const existing = currentAttrValues.find(
                            val => val.attribute_id === attr.id
                        );

                        return existing || {
                            attribute_id: attr.id,
                            attribute_title: attr.title,
                            required: attr.is_required || false,
                            value: ""
                        };
                    });

                    setFormData(prev => ({
                        ...prev,
                        custom_attribute_values: newAttrValues
                    }));
                }
            }
        }
    }, [formData.category_id, categories, getSearchFields, getCategoryAttributes]);

    // Form field handlers
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Clear field error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and empty string
        if (value === "" || /^\d+$/.test(value)) {
            handleChange(e);
        }
    };

    const handleRegionChange = (e) => {
        const regionId = e.target.value;
        setFormData({
            ...formData,
            region_id: regionId,
            city_id: "", // Reset city when region changes
            district: "" // Reset district when region changes
        });

        selectRegion(regionId)
    };

    const handlePhoneChange = (index, value) => {
        const updatedPhones = [...formData.phones];
        updatedPhones[index] = value;

        setFormData({
            ...formData,
            phones: updatedPhones
        });
    };

    const addPhoneField = () => {
        setFormData({
            ...formData,
            phones: [...formData.phones, ""]
        });
    };

    const removePhoneField = (index) => {
        const updatedPhones = [...formData.phones];
        updatedPhones.splice(index, 1);

        setFormData({
            ...formData,
            phones: updatedPhones.length ? updatedPhones : [""] // Keep at least one phone field
        });
    };

    const handleAttributeChange = (attributeId, value) => {
        const updatedAttributes = formData.custom_attribute_values.map(attr => {
            if (attr.attribute_id === attributeId) {
                return { ...attr, value };
            }
            return attr;
        });

        setFormData({
            ...formData,
            custom_attribute_values: updatedAttributes
        });

        // Clear attribute errors
        if (errors.custom_attribute_values) {
            setErrors({
                ...errors,
                custom_attribute_values: null
            });
        }
    };

    const handleImageChange = (files) => {
        // Add new files to images array
        if (files) {
            const newFiles = Array.isArray(files) ? files : [files];

            // Update form data
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles]
            }));

            // Create preview URLs for display
            const newPreviews = newFiles.map(file => ({
                id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url: URL.createObjectURL(file),
                file: file,
                isExisting: false
            }));

            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const handleImageRemove = (imageToRemove) => {
        // If existing image, add to deleted list
        if (imageToRemove.isExisting) {
            setDeletedImageIds(prev => [...prev, imageToRemove.id]);
        }

        // Remove from preview list
        setPreviewImages(prev =>
            prev.filter(image => image.id !== imageToRemove.id)
        );

        // Remove from form data if it's a new image
        if (!imageToRemove.isExisting) {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter(image =>
                    image !== imageToRemove.file
                )
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.title.trim()) {
            newErrors.title = "Требуется заголовок";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Требуется описание";
        }

        if (!formData.category_id) {
            newErrors.category_id = "Выберите категорию";
        }

        if (formData.price && !formData.currency_id) {
            newErrors.currency_id = "Выберите валюту";
        }

        if (formData.region_id && !formData.city_id) {
            newErrors.city_id = "Выберите город";
        }

        // Validate phones
        const validPhones = formData.phones.filter(phone => phone.trim() !== "");
        if (validPhones.length === 0) {
            newErrors.phones = "Укажите хотя бы один номер телефона";
        }

        // Validate location from map
        if (!formData.location) {
            newErrors.location = "Пожалуйста, укажите местоположение на карте";
        }

        // Validate required custom attributes
        if (formData.custom_attribute_values?.length) {
            const attributeErrors = {};

            formData.custom_attribute_values.forEach(attr => {
                if (attr.required && !attr.value) {
                    attributeErrors[attr.attribute_id] = `Поле "${attr.attribute_title}" обязательно`;
                }
            });

            if (Object.keys(attributeErrors).length > 0) {
                newErrors.custom_attribute_values = attributeErrors;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Prepare data for submission
            const submissionData = {
                ...formData,
                // Filter out empty phone numbers
                phones: formData.phones.filter(phone => phone.trim() !== ""),
                // Add deleted image IDs for edit mode
                ...(isEditMode && { deleted_image_ids: deletedImageIds })
            };

            onSubmit(submissionData);
        } else {
            setShowErrorSummary(true);
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <SelectCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSelect={(category) => {
                    setSelectedCategory(category);
                    setFormData({
                        ...formData,
                        category_id: category.id
                    });
                    setIsCategoryModalOpen(false);
                }}
                initialSelectedId={formData.category_id}
            />
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error summary */}
                {showErrorSummary && Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-2">Пожалуйста, исправьте следующие ошибки:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>
                                    {key === 'custom_attribute_values'
                                        ? Object.values(value).map((attrError, i) => (
                                            <div key={i}>{attrError}</div>
                                        ))
                                        : value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Main form fields */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Основная информация
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Category selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Категория <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className={`block w-full rounded-lg border ${errors.category_id ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-left`}
                                    >
                                        {selectedCategory ? selectedCategory.name : "Выберите категорию"}
                                    </button>
                                    <Info
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5"
                                    />
                                </div>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Заголовок <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className={`block w-full rounded-lg border ${errors.title ? 'border-red-300' : 'border-gray-300'
                                    } px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                placeholder="Заголовок объявления"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Описание <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className={`block w-full rounded-lg border ${errors.description ? 'border-red-300' : 'border-gray-300'
                                    } px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                placeholder="Подробное описание товара или услуги"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Цена
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={formData.price}
                                    onChange={handlePriceChange}
                                    className={`block w-full rounded-lg border ${errors.price ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                    placeholder="Цена"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="currency_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Валюта
                                </label>
                                <div className="relative">
                                    <select
                                        id="currency_id"
                                        name="currency_id"
                                        value={formData.currency_id}
                                        onChange={handleChange}
                                        className={`block w-full rounded-lg border ${errors.currency_id ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                    >
                                        <option value="">Выберите валюту</option>
                                        {currencies.map(currency => (
                                            <option key={currency.id} value={currency.id}>
                                                {currency.name} ({currency.symbol})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.currency_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currency_id}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Местоположение
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Region */}
                            <div>
                                <label htmlFor="region_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Регион
                                </label>
                                <div className="relative">
                                    <select
                                        id="region_id"
                                        name="region_id"
                                        value={formData.region_id}
                                        onChange={handleRegionChange}
                                        className={`block w-full rounded-lg border ${errors.region_id ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                    >
                                        <option value="">Выберите регион</option>
                                        {regions.map(region => (
                                            <option key={region.id} value={region.id}>
                                                {region.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.region_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.region_id}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Город
                                </label>
                                <div className="relative">
                                    <select
                                        id="city_id"
                                        name="city_id"
                                        value={formData.city_id}
                                        onChange={handleChange}
                                        disabled={!formData.region_id}
                                        className={`block w-full rounded-lg border ${errors.city_id ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500`}
                                    >
                                        <option value="">Выберите город</option>
                                        {formData.region_id && cities?.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.city_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>
                                )}
                            </div>
                        </div>

                        {/* District */}
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                Район/микрорайон
                            </label>
                            <input
                                id="district"
                                name="district"
                                type="text"
                                value={formData.district}
                                onChange={handleChange}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Например: мкр. Асанбай, ул. Киевская"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Адрес
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Полный адрес"
                            />
                        </div>

                        {/* Map Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Местоположение на карте <span className="text-red-500">*</span>
                            </label>
                            <div 
                                id="map-container" 
                                style={{ width: "100%", height: "400px", borderRadius: "0.5rem", overflow: "hidden" }}
                                className={`border ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
                            ></div>
                            <p className="mt-2 text-sm text-gray-500 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                Поставьте маркер на карте, перетащив его в нужное место
                            </p>
                            
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                            
                            {formData.location && (
                                <div className="mt-2 text-sm text-gray-700">
                                    Координаты: {formData.location.latitude}, {formData.location.longitude}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Контактная информация
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Phone numbers */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Телефоны <span className="text-red-500">*</span>
                            </label>

                            {formData.phones.map((phone, index) => (
                                <div key={index} className="flex items-center mb-3 last:mb-0">
                                    <div className="flex-grow relative">
                                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                                            className={`block w-full rounded-lg border ${errors.phones ? 'border-red-300' : 'border-gray-300'
                                                } pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                            placeholder="+996 XXX XXXXXX"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removePhoneField(index)}
                                        className={`ml-2 p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 ${formData.phones.length === 1 ? 'invisible' : ''
                                            }`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            {errors.phones && (
                                <p className="mt-1 text-sm text-red-600">{errors.phones}</p>
                            )}

                            <button
                                type="button"
                                onClick={addPhoneField}
                                className="mt-3 flex items-center text-sm text-primary hover:text-primary/80"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Добавить телефон
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images and video */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Фотографии и видео
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Фотографии
                            </label>

                            <div className="mb-4">
                                <DragAndDropUploader
                                    onChange={handleImageChange}
                                    multiple={true}
                                />

                                <p className="mt-2 text-sm text-gray-500">
                                    Вы можете загрузить до 10 изображений. Рекомендуемый размер - не менее 800x600 пикселей.
                                </p>
                            </div>

                            {/* Image previews */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                    {previewImages.map(image => (
                                        <div key={image.id} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={image.url}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleImageRemove(image)}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-600 opacity-80 hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video */}
                        <div>
                            <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                                Видео (YouTube или Vimeo URL)
                            </label>
                            <input
                                id="video"
                                name="video"
                                type="text"
                                value={formData.video}
                                onChange={handleChange}
                                className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Вставьте ссылку на видео с YouTube или Vimeo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Custom attributes */}
                {categoryAttributes.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Характеристики
                            </h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {formData.custom_attribute_values.map((attr) => {
                                    const attribute = categoryAttributes.find(a => a.id === attr.attribute_id);
                                    if (!attribute) return null;

                                    const hasError = errors.custom_attribute_values &&
                                        errors.custom_attribute_values[attr.attribute_id];

                                    return (
                                        <div key={attr.attribute_id}>
                                            <label
                                                htmlFor={`attr-${attr.attribute_id}`}
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                {attr.attribute_title}
                                                {attr.required && <span className="text-red-500"> *</span>}
                                            </label>

                                            <NewCustomAttributeField
                                                item={attribute}
                                                value={attr.value}
                                                onChange={(value) => handleAttributeChange(attr.attribute_id, value)}
                                                className={`block w-full rounded-lg border ${hasError ? 'border-red-300' : 'border-gray-300'
                                                    } px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
                                            />

                                            {hasError && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.custom_attribute_values[attr.attribute_id]}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Car Attributes - only shown when category kind is "cars" */}
                {selectedCategory && selectedCategory.kind === 'cars' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Параметры траспорта
                            </h3>
                        </div>

                        <div className="p-6 space-y-6 min-h-[200px]">
                            <CarAttributes
                                type={formData.car_attributes?.type}
                                mark={formData.car_attributes?.mark}
                                model={formData.car_attributes?.model}
                                generation={formData.car_attributes?.generation}
                                series={formData.car_attributes?.series}
                                modification={formData.car_attributes?.modification}
                                characteristics={formData.car_attributes?.characteristics}
                                onChange={(carAttrs) => {
                                    console.log(carAttrs)
                                    setFormData(prev => ({
                                        ...prev,
                                        car_attributes: carAttrs
                                    }));
                                    
                                    // Clear car attributes errors if they exist
                                    if (errors.car_attributes) {
                                        setErrors({
                                            ...errors,
                                            car_attributes: null
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Form errors and submit */}
                <div className="flex flex-col gap-4">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                            <div className="flex items-start">
                                <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                <div>{submitError}</div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Сохранение...
                                </>
                            ) : (
                                buttonText
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ProductForm;