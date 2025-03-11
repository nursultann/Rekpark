import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useBusinessQuery from '../../../hooks/useBusinessQuery';
import { 
  ChevronRight, Check, X, Clock, Globe, Phone, Mail, 
  Instagram, Facebook, Twitter, MapPin, Plus, Calendar,
  CreditCard, AlertTriangle, Upload, Camera, Trash
} from 'lucide-react';

// Schedule day component for business hours
const ScheduleDay = ({ day, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(value?.isOpen !== false);
  const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    onChange(day, {
      isOpen: newIsOpen,
      open: newIsOpen ? value?.open || '09:00' : null,
      close: newIsOpen ? value?.close || '18:00' : null
    });
  };

  const handleTimeChange = (timeType, time) => {
    onChange(day, {
      ...value,
      [timeType]: time
    });
  };

  return (
    <div className="flex flex-wrap items-center py-3 border-b border-gray-100 last:border-0">
      <div className="w-28 font-medium text-gray-700">{formattedDay}</div>

      <div className="flex items-center mr-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isOpen}
            onChange={handleToggle}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
          <span className="ml-2 text-sm font-medium text-gray-700 w-16">
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </label>
      </div>

      {isOpen && (
        <div className="flex items-center mt-2 sm:mt-0">
          <input
            type="time"
            className="border border-gray-300 rounded-md text-sm p-2 w-24"
            value={value?.open || '09:00'}
            onChange={(e) => handleTimeChange('open', e.target.value)}
          />
          <span className="mx-2 text-gray-500">—</span>
          <input
            type="time"
            className="border border-gray-300 rounded-md text-sm p-2 w-24"
            value={value?.close || '18:00'}
            onChange={(e) => handleTimeChange('close', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

// Image upload field component
const ImageUploadField = ({ label, onChange, previewUrl = null, hint = null }) => {
  const [preview, setPreview] = useState(previewUrl);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      
      <div className="mt-1">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt={label}
              className="h-40 w-full object-cover rounded-lg border border-gray-200"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
              <button 
                type="button" 
                className="p-2 bg-white rounded-full"
                onClick={() => {
                  setPreview(null);
                  onChange(null);
                }}
              >
                <Trash className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <Camera className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 mb-1">Drag and drop or click to upload</span>
            <span className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</span>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Social media field component with nice icons
const SocialMediaField = ({ socials = {}, onChange }) => {
  const handleChange = (platform, value) => {
    onChange({
      ...socials,
      [platform]: value
    });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-base font-medium text-gray-900">Social Media Profiles</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Instagram className="h-4 w-4" />
            </span>
            <input
              type="text"
              id="instagram"
              className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
              placeholder="username"
              value={socials?.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Facebook className="h-4 w-4" />
            </span>
            <input
              type="text"
              id="facebook"
              className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
              placeholder="username or page name"
              value={socials?.facebook || ''}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Twitter className="h-4 w-4" />
            </span>
            <input
              type="text"
              id="twitter"
              className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
              placeholder="username"
              value={socials?.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Globe className="h-4 w-4" />
            </span>
            <input
              type="url"
              id="website"
              className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
              placeholder="https://example.com"
              value={socials?.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Phone input component with add/remove functionality
const PhoneInput = ({ phones = [''], onChange }) => {
  const addPhone = () => {
    onChange([...phones, '']);
  };

  const removePhone = (index) => {
    if (phones.length === 1) return; // Keep at least one
    const newPhones = [...phones];
    newPhones.splice(index, 1);
    onChange(newPhones);
  };

  const updatePhone = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    onChange(newPhones);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
      <div className="space-y-3">
        {phones.map((phone, index) => (
          <div key={index} className="flex">
            <div className="flex rounded-md shadow-sm flex-grow">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => updatePhone(index, e.target.value)}
              />
            </div>
            <button
              type="button"
              className={`ml-2 p-2 text-gray-400 hover:text-red-500 focus:outline-none ${phones.length === 1 ? 'invisible' : ''}`}
              onClick={() => removePhone(index)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addPhone}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Phone
        </button>
      </div>
    </div>
  );
};

const CreateBusinessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchBusinessPlans, createBusinessAccount } = useBusinessQuery();

  // Get the selected plan from location state or fetch first available
  const [selectedPlan, setSelectedPlan] = useState(location.state?.selectedPlan || null);
  const [selectedPeriod, setSelectedPeriod] = useState(location.state?.selectedPeriod || null);

  // Form state for business information
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    phones: [''],
    whatsapp: '',
    site: '',
    email: '',
    address: '',
    schedule: {
      monday: { isOpen: true, open: '09:00', close: '18:00' },
      tuesday: { isOpen: true, open: '09:00', close: '18:00' },
      wednesday: { isOpen: true, open: '09:00', close: '18:00' },
      thursday: { isOpen: true, open: '09:00', close: '18:00' },
      friday: { isOpen: true, open: '09:00', close: '18:00' },
      saturday: { isOpen: true, open: '10:00', close: '16:00' },
      sunday: { isOpen: false, open: null, close: null }
    },
    socials: {},
    location: null,
    logotype: null,
    cover: null
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch plans if not available from location state
  useEffect(() => {
    if (!selectedPlan) {
      fetchBusinessPlans().then(plans => {
        if (plans && plans.length > 0) {
          setSelectedPlan(plans[0]);

          // Select first period if available
          if (plans[0].periods && plans[0].periods.length > 0) {
            setSelectedPeriod(plans[0].periods[0]);
          }
        }
      });
    }
  }, [fetchBusinessPlans, selectedPlan]);

  // Form field update methods
  const updateField = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if exists
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const updateScheduleDay = (day, value) => {
    setFormState(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: value
      }
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formState.name.trim()) {
      errors.name = 'Business name is required';
    }

    if (!formState.description.trim()) {
      errors.description = 'Description is required';
    } else if (formState.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!formState.phones[0].trim()) {
      errors.phones = 'At least one phone number is required';
    }

    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!selectedPlan) {
      setError('Please select a business plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const businessData = {
        ...formState,
        plan_id: selectedPlan.id,
        period: selectedPeriod?.period || 1,
        // period_id: selectedPeriod?.id || 1
      };

      // Filter out empty phones
      businessData.phones = businessData.phones.filter(phone => phone.trim());

      // Create business account
      await createBusinessAccount(businessData);

      setSuccess(true);
      // Redirect after a delay
      setTimeout(() => {
        navigate('/business/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error creating business:', err);
      setError(err.message || 'Failed to create business account. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link to="/business-plans" className="hover:text-primary">Business Plans</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-700">Create Business</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Business Account</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {success ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Account Created!</h2>
            <p className="text-gray-600 mb-6">Your business account has been successfully created. You will be redirected to your dashboard shortly.</p>
            <div className="animate-pulse">
              <div className="h-1 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Selected Plan Summary */}
              {selectedPlan && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Selected Plan</h2>
                    <Link to="/business-plans" className="text-sm text-primary hover:text-primary/80">
                      Change plan
                    </Link>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-primary">{selectedPlan.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{selectedPlan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {selectedPeriod ? selectedPeriod.price : selectedPlan.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPeriod
                          ? `${selectedPeriod.period} ${selectedPlan.interval}`
                          : selectedPlan.interval}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>You will be charged only after your account is created and activated</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Information Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Business Information</h2>

                <div className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 ${
                        formErrors.name 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-primary focus:border-primary'
                      }`}
                      placeholder="Enter your business name"
                      value={formState.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Business Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      className={`block w-full rounded-md shadow-sm sm:text-sm px-3 py-2 ${
                        formErrors.description 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-primary focus:border-primary'
                      }`}
                      placeholder="Describe your business, services, and what makes you unique..."
                      value={formState.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      required
                    ></textarea>
                    {formErrors.description ? (
                      <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Minimum 20 characters</p>
                    )}
                  </div>

                  {/* Phone Numbers */}
                  <div>
                    <PhoneInput
                      phones={formState.phones}
                      onChange={(phones) => updateField('phones', phones)}
                    />
                    {formErrors.phones && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phones}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </span>
                      <input
                        type="tel"
                        id="whatsapp"
                        className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
                        placeholder="+1 (555) 123-4567"
                        value={formState.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Optional - for WhatsApp Business chat</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={`flex-1 min-w-0 block w-full rounded-none rounded-r-md border ${
                          formErrors.email ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm`}
                        placeholder="business@example.com"
                        value={formState.email}
                        onChange={(e) => updateField('email', e.target.value)}
                      />
                    </div>
                    {formErrors.email ? (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">For business inquiries and notifications</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        id="address"
                        className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 sm:text-sm"
                        placeholder="123 Business St, City, State, ZIP"
                        value={formState.address}
                        onChange={(e) => updateField('address', e.target.value)}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Physical location of your business</p>
                  </div>

                  {/* Social Media */}
                  <SocialMediaField
                    socials={formState.socials}
                    onChange={(socials) => updateField('socials', socials)}
                  />
                </div>
              </div>

              {/* Business Hours Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
                </div>

                <div>
                  {Object.entries(formState.schedule).map(([day, value]) => (
                    <ScheduleDay
                      key={day}
                      day={day}
                      value={value}
                      onChange={updateScheduleDay}
                    />
                  ))}
                </div>
              </div>

              {/* Business Images Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Business Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ImageUploadField
                    label="Business Logo"
                    hint="Square format recommended (at least 400x400px)"
                    onChange={(file) => updateField('logotype', file)}
                  />

                  <ImageUploadField
                    label="Cover Image"
                    hint="Landscape format recommended (at least 1200x600px)"
                    onChange={(file) => updateField('cover', file)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-8 py-3 bg-primary text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Business...
                    </span>
                  ) : (
                    'Create Business Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBusinessPage;