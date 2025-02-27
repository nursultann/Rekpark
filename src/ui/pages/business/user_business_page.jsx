import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Edit, Plus, Trash, Calendar, MapPin, Mail, Phone, Globe, Package, Instagram, Facebook, X } from 'lucide-react';
import useToast from '../../../hooks/useToast';
import useBusinessProfile from '../../../hooks/useBusinessProfile';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const UserBusinessPage = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [galleryTitle, setGalleryTitle] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phones: '',
        whatsapp: '',
        site: '',
        email: '',
        address: '',
        socials: {
            instagram: '',
            facebook: '',
            twitter: ''
        },
        schedule: {
            Monday: { open: '09:00', close: '18:00', isActive: true },
            Tuesday: { open: '09:00', close: '18:00', isActive: true },
            Wednesday: { open: '09:00', close: '18:00', isActive: true },
            Thursday: { open: '09:00', close: '18:00', isActive: true },
            Friday: { open: '09:00', close: '18:00', isActive: true },
            Saturday: { open: '10:00', close: '16:00', isActive: true },
            Sunday: { open: '10:00', close: '16:00', isActive: false }
        }
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Use the new useBusinessProfile hook
    const {
        businessProfile,
        loading,
        error,
        updateBusinessProfile,
        cancelBusinessSubscription,
        addPhotoGallery,
        deletePhotoGallery,
        refreshBusinessProfile,
        isActive
    } = useBusinessProfile();

    // Helper function to update form data from business object
    const updateFormDataFromBusiness = (business) => {
        if (!business) return;

        setFormData({
            name: business.name || '',
            description: business.description || '',
            phones: typeof business.phones === 'string' ? business.phones : JSON.stringify(business.phones),
            whatsapp: business.whatsapp || '',
            site: business.site || '',
            email: business.email || '',
            address: business.address || '',
            socials: business.socials || {
                instagram: '',
                facebook: '',
                twitter: ''
            },
            schedule: business.schedule || {
                Monday: { open: '09:00', close: '18:00', isActive: true },
                Tuesday: { open: '09:00', close: '18:00', isActive: true },
                Wednesday: { open: '09:00', close: '18:00', isActive: true },
                Thursday: { open: '09:00', close: '18:00', isActive: true },
                Friday: { open: '09:00', close: '18:00', isActive: true },
                Saturday: { open: '10:00', close: '16:00', isActive: true },
                Sunday: { open: '10:00', close: '16:00', isActive: false }
            }
        });

        setLogoPreview(business.logoImage);
        setCoverPreview(business.coverImage);
    };

    // Load business data into form when it becomes available
    useEffect(() => {
        if (businessProfile) {
            updateFormDataFromBusiness(businessProfile);
        }
    }, [businessProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socials: {
                ...prev.socials,
                [name]: value
            }
        }));
    };

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value
                }
            }
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logotype: file
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                cover: file
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesChange = (e) => {
        if (e.target.files) {
            setGalleryImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await updateBusinessProfile(formData);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Business profile updated successfully",
                    variant: "success"
                });
                setIsEditing(false);
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update business profile",
                variant: "destructive"
            });
        }
    };

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel your business account? This action cannot be undone.")) {
            try {
                const result = await cancelBusinessSubscription();
                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Business account cancelled successfully",
                        variant: "success"
                    });
                    refreshBusinessProfile();
                } else {
                    throw new Error(result.error);
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.message || "Failed to cancel business account",
                    variant: "destructive"
                });
            }
        }
    };

    const handleAddGallery = async (e) => {
        e.preventDefault();
        setUploadingGallery(true);

        try {
            const result = await addPhotoGallery(galleryTitle, galleryImages);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Photo gallery added successfully",
                    variant: "success"
                });

                setGalleryTitle('');
                setGalleryImages([]);
                refreshBusinessProfile();
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to add photo gallery",
                variant: "destructive"
            });
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleDeleteGallery = async (galleryId) => {
        if (window.confirm("Are you sure you want to delete this gallery? This action cannot be undone.")) {
            try {
                const result = await deletePhotoGallery(galleryId);
                if (result.success) {
                    toast({
                        title: "Success",
                        description: "Photo gallery deleted successfully",
                        variant: "success"
                    });
                    refreshBusinessProfile();
                } else {
                    throw new Error(result.error);
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.message || "Failed to delete photo gallery",
                    variant: "destructive"
                });
            }
        }
    };

    if (loading && !businessProfile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error && !businessProfile) {
        return (
            <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Error loading business data: {error}</span>
            </div>
        );
    }

    // If no business account exists
    if (!loading && !businessProfile) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center p-8 border rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">You don't have a business account yet</h2>
                    <p className="text-gray-600 mb-6">
                        Create a business account to showcase your business, add contact information,
                        and manage your business profile.
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                            onClick={() => window.location.href = '/business/create'}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Business Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {!businessProfile ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            ) : (
        <>
                    {/* Header with Cover Image */}
                    <div className="relative rounded-lg overflow-hidden mb-6 h-64">
                        {coverPreview ? (
                            <img src={coverPreview} alt="Business cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Cover Image</span>
                            </div>
                        )}

                        {/* Business Logo & Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end">
                            <div className="mr-4 w-20 h-20 bg-white rounded-lg overflow-hidden border-4 border-white shadow-md">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Business logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{businessProfile.name}</h1>
                                <div className="flex space-x-2 text-white/80 text-sm">
                                    <span className="bg-blue-500/20 px-2 py-0.5 rounded">
                                        {businessProfile.businessPlan?.name || 'Free Plan'}
                                    </span>
                                    {businessProfile.end_at && (
                                        <span className="bg-gray-500/20 px-2 py-0.5 rounded">
                                            Expires: {new Date(businessProfile.end_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="ml-auto">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-md flex items-center text-sm shadow-sm"
                                >
                                    <Edit className="w-4 h-4 mr-1.5" />
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b mb-6">
                        <div className="flex space-x-1">
                            {['profile', 'gallery', 'settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 font-medium text-sm capitalize ${activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="mb-8">
                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left column - Business Info */}
                                <div className="lg:col-span-2">
                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Business Information</h3>

                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Business Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="phones" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone Numbers (comma separated)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phones"
                                                        name="phones"
                                                        value={formData.phones}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                                                            WhatsApp Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="whatsapp"
                                                            name="whatsapp"
                                                            value={formData.whatsapp}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Website
                                                        </label>
                                                        <input
                                                            type="url"
                                                            id="site"
                                                            name="site"
                                                            value={formData.site}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="address"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Social Media</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Instagram
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="instagram"
                                                            name="instagram"
                                                            value={formData.socials.instagram}
                                                            onChange={handleSocialsChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Facebook
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="facebook"
                                                            name="facebook"
                                                            value={formData.socials.facebook}
                                                            onChange={handleSocialsChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Twitter
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="twitter"
                                                            name="twitter"
                                                            value={formData.socials.twitter}
                                                            onChange={handleSocialsChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Business Schedule</h3>

                                                <div className="space-y-3">
                                                    {daysOfWeek.map(day => (
                                                        <div key={day} className="flex items-center space-x-4">
                                                            <div className="w-24">
                                                                <span className="text-sm font-medium text-gray-700">{day}</span>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`${day}-active`}
                                                                    checked={formData.schedule[day]?.isActive || false}
                                                                    onChange={(e) => handleScheduleChange(day, 'isActive', e.target.checked)}
                                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <label htmlFor={`${day}-active`} className="text-sm text-gray-600">
                                                                    Open
                                                                </label>
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="time"
                                                                    value={formData.schedule[day]?.open || '09:00'}
                                                                    onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                                                                    disabled={!formData.schedule[day]?.isActive}
                                                                    className="px-2 py-1 border border-gray-300 rounded-md w-24 text-sm"
                                                                />
                                                                <span className="text-gray-500">to</span>
                                                                <input
                                                                    type="time"
                                                                    value={formData.schedule[day]?.close || '18:00'}
                                                                    onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                                                                    disabled={!formData.schedule[day]?.isActive}
                                                                    className="px-2 py-1 border border-gray-300 rounded-md w-24 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Business Images</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Logo Image
                                                        </label>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-16 h-16 border rounded-md overflow-hidden bg-gray-100">
                                                                {logoPreview ? (
                                                                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full text-gray-400">
                                                                        <span className="text-xs">No logo</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                id="logo"
                                                                accept="image/*"
                                                                onChange={handleLogoChange}
                                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Cover Image
                                                        </label>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-16 h-16 border rounded-md overflow-hidden bg-gray-100">
                                                                {coverPreview ? (
                                                                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full text-gray-400">
                                                                        <span className="text-xs">No cover</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                id="cover"
                                                                accept="image/*"
                                                                onChange={handleCoverChange}
                                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Business Description */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">About</h3>
                                                <p className="text-gray-700 whitespace-pre-line">{businessProfile.description}</p>
                                            </div>

                                            {/* Contact Information */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                                                <div className="space-y-3">
                                                    {businessProfile.phones && (
                                                        <div className="flex items-start">
                                                            <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700">Phone</h4>
                                                                <p className="text-gray-600">
                                                                    {Array.isArray(businessProfile.phones)
                                                                        ? businessProfile.phones.join(', ')
                                                                        : businessProfile.phones}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {businessProfile.email && (
                                                        <div className="flex items-start">
                                                            <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700">Email</h4>
                                                                <p className="text-gray-600">{businessProfile.email}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {businessProfile.site && (
                                                        <div className="flex items-start">
                                                            <Globe className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700">Website</h4>
                                                                <a
                                                                    href={businessProfile.site.startsWith('http') ? businessProfile.site : `https://${businessProfile.site}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    {businessProfile.site}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {businessProfile.whatsapp && (
                                                        <div className="flex items-start">
                                                            <Phone className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700">WhatsApp</h4>
                                                                <p className="text-gray-600">{businessProfile.whatsapp}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {businessProfile.address && (
                                                        <div className="flex items-start">
                                                            <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700">Address</h4>
                                                                <p className="text-gray-600">{businessProfile.address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Social Media */}
                                            {businessProfile.socials && Object.values(businessProfile.socials).some(val => val) && (
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">Social Media</h3>
                                                    <div className="flex space-x-4">
                                                        {businessProfile.socials.instagram && (
                                                            <a
                                                                href={`https://instagram.com/${businessProfile.socials.instagram}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-pink-600 hover:text-pink-700"
                                                            >
                                                                <Instagram className="w-6 h-6" />
                                                            </a>
                                                        )}

                                                        {businessProfile.socials.facebook && (
                                                            <a
                                                                href={`https://facebook.com/${businessProfile.socials.facebook}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Facebook className="w-6 h-6" />
                                                            </a>
                                                        )}

                                                        {businessProfile.socials.twitter && (
                                                            <a
                                                                href={`https://twitter.com/${businessProfile.socials.twitter}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-400 hover:text-blue-500"
                                                            >
                                                                <X className="w-6 h-6" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Business Hours */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">Business Hours</h3>
                                                {businessProfile.schedule ? (
                                                    <div className="space-y-2">
                                                        {daysOfWeek.map(day => {
                                                            const daySchedule = businessProfile.schedule[day];
                                                            if (!daySchedule) return null;

                                                            return (
                                                                <div key={day} className="flex">
                                                                    <div className="w-28 font-medium text-gray-700">{day}</div>
                                                                    {daySchedule.isActive ? (
                                                                        <div className="text-gray-700">
                                                                            {daySchedule.open} - {daySchedule.close}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-gray-500">Closed</div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">Business hours not available</p>
                                                )}
                                            </div>

                                            {/* Business Plan Information */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">Business Plan</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-start">
                                                        <Package className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700">Current Plan</h4>
                                                            <p className="text-gray-600 font-medium">{businessProfile.businessPlan?.name || 'Free Plan'}</p>
                                                            {businessProfile.businessPlan?.description && (
                                                                <p className="text-sm text-gray-500 mt-1">{businessProfile.businessPlan.description}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Plan Features</h4>
                                                        {businessProfile.features && businessProfile.features.length > 0 ? (
                                                            <ul className="space-y-1">
                                                                {businessProfile.features.map((feature, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                                                        <span className="text-sm text-gray-600">{feature.name}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No features available</p>
                                                        )}
                                                    </div>

                                                    {businessProfile.end_at && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                                            <div className="flex items-center">
                                                                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                                                <span className="text-sm text-gray-700">
                                                                    Expires on {new Date(businessProfile.end_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-8">
                                {/* Add Photo Gallery Form */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-4">Add New Photo Gallery</h3>
                                    <form onSubmit={handleAddGallery} className="space-y-4">
                                        <div>
                                            <label htmlFor="galleryTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                                Gallery Title
                                            </label>
                                            <input
                                                type="text"
                                                id="galleryTitle"
                                                value={galleryTitle}
                                                onChange={(e) => setGalleryTitle(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700 mb-1">
                                                Gallery Images
                                            </label>
                                            <input
                                                type="file"
                                                id="galleryImages"
                                                multiple
                                                accept="image/*"
                                                onChange={handleGalleryImagesChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                            {galleryImages.length > 0 && (
                                                <p className="mt-2 text-sm text-gray-500">{galleryImages.length} images selected</p>
                                            )}
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                                                disabled={uploadingGallery}
                                            >
                                                {uploadingGallery ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Gallery
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Existing Galleries */}
                                {businessProfile.galleries && businessProfile.galleries.length > 0 ? (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium">Photo Galleries</h3>
                                        
                                        {businessProfile.galleries.map((gallery) => (
                                            <div key={gallery.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-md font-medium">{gallery.title}</h4>
                                                    <button
                                                        onClick={() => handleDeleteGallery(gallery.id)}
                                                        className="text-red-600 hover:text-red-800 flex items-center text-sm"
                                                    >
                                                        <Trash className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {gallery.images && gallery.images.map((image) => (
                                                        <div key={image.id} className="aspect-square rounded-md overflow-hidden">
                                                            <img
                                                                src={image.url}
                                                                alt={`Gallery image ${image.id}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No photo galleries yet. Add your first gallery above!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-6">Account Settings</h3>
                                    
                                    {/* Plan Upgrade */}
                                    <div className="mb-8">
                                        <h4 className="text-md font-medium mb-2">Business Plan</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            You are currently on the {businessProfile.businessPlan?.name || 'Free Plan'} plan.
                                            {businessProfile.end_at && (
                                                <> Your plan expires on {new Date(businessProfile.end_at).toLocaleDateString()}.</>
                                            )}
                                        </p>
                                        
                                        <button
                                            onClick={() => window.location.href = '/business/plans'}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Upgrade Plan
                                        </button>
                                    </div>
                                    
                                    {/* Cancel Business Account */}
                                    <div className="border-t pt-6">
                                        <h4 className="text-md font-medium mb-2 text-red-600">Cancel Business Account</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Warning: Cancelling your business account will remove all your business information
                                            and cannot be undone. Your subscription will be cancelled at the end of the billing period.
                                        </p>
                                        
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 flex items-center"
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Cancel Business Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserBusinessPage;