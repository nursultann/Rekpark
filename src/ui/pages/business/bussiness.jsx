import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import useBusinessQuery from '../../../hooks/useBusinessQuery';
import { Check, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

// Period selection grid component
const PeriodSelectGrid = ({ selected, onSelect, list }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
      {list.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={`
            py-3 px-4 rounded-xl text-center transition-all duration-200 relative
            shadow-sm hover:shadow transform hover:-translate-y-0.5
            ${selected === item.value 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }
          `}
        >
          <span className="text-sm font-medium">{item.title}</span>
          {item.badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Function to calculate pricing based on selected period
const getPeriod = (businessPlan, selectedPeriod) => {
  const periods = businessPlan.periods;
  if (periods && periods.length > 0) {
    const foundPeriod = periods.find(element => element.period === selectedPeriod);
    if (foundPeriod) return foundPeriod;
    
    // If not found, calculate price
    return {
      price: businessPlan.price * selectedPeriod,
      period: selectedPeriod,
    };
  }

  return {
    price: businessPlan.price * selectedPeriod,
    period: selectedPeriod,
  };
};

// Plan container component
const PlanContainer = ({ businessPlan, selectedPeriod, onSelect }) => {
  // Calculate the period price
  const period = getPeriod(businessPlan, selectedPeriod);
  
  // Get gradient colors (using default if none provided)
  const colors = businessPlan.color?.split(',').map(c => c.replace('#FF', '#')) || ['#587fb3', '#3a5a8a'];
  
  // List of features to display
  const features = businessPlan.features?.map(f => ({
    title: f.name,
    feature: true
  })) || [];
  
  
  // Filter only active features
  const activeFeatures = features.filter(f => f.feature);

  return (
    <div 
      className="mb-8 rounded-[22px] p-[3px] shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[colors.length-1] || colors[0]} 100%)`
      }}
    >
      <div className="bg-white rounded-[20px] px-8 py-8 flex flex-col items-center">
        <h3 
          className="text-2xl font-bold mb-3"
          style={{ color: colors[0] }}
        >
          {businessPlan.name}
        </h3>
        
        {period.old_price && period.old_price > 0 && (
          <div className="text-gray-400 line-through text-sm mb-2">
            {period.oldPrice} сом
          </div>
        )}
        
        <div 
          className="border-2 rounded-xl px-10 py-3 mb-6 shadow-sm"
          style={{ borderColor: colors[0] }}
        >
          <span className="text-xl font-bold">{period.price} сом</span>
        </div>
        
        {businessPlan.description && (
          <p className="text-center text-gray-600 mb-8 font-light max-w-md">
            {businessPlan.description}
          </p>
        )}
        
        {/* Features List */}
        <div className="w-full mb-8 bg-gray-50 rounded-xl p-4">
          {activeFeatures.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="py-3 text-center flex items-center justify-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                <span className="font-medium text-gray-700">{feature.title}</span>
              </div>
              {index < activeFeatures.length - 1 && <hr className="border-gray-200" />}
            </React.Fragment>
          ))}
        </div>
        
        {/* Bonus Balance */}
        {businessPlan.hasBalanceFillFeature && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full mb-2 shadow-md">
              +{businessPlan.balanceFillFeature?.value} units
            </div>
            <div className="text-sm text-gray-500 font-medium">bonus balance</div>
          </div>
        )}
        
        {/* Connect Button */}
        <button
          onClick={() => onSelect(businessPlan)}
          className="w-full py-4 px-4 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[colors.length-1] || colors[0]} 100%)`
          }}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

const BusinessPlansPage = () => {
  const navigate = useNavigate();
  const { businessPlans, loading, error, fetchBusinessPlans } = useBusinessQuery({
    fetchOnMount: false
  });
  
  // State for selected period and plan
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // List of available periods
  const periodOptions = [
    { title: '1 month', value: 1, badge: null },
    { title: '3 months', value: 3, badge: null },
    { title: '6 months', value: 6, badge: null },
    { title: '1 year', value: 12, badge: null },
  ];
  
  useEffectOnce(() => {
    fetchBusinessPlans();
  });
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    
    // Calculate the period price to pass to the next screen
    const periodData = getPeriod(plan, selectedPeriod);
    
    // Navigate to business creation with plan data
    navigate('/create-business', { 
      state: { 
        selectedPlan: plan,
        selectedPeriod: periodData
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading business plans...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Error Loading Plans</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button 
            onClick={() => fetchBusinessPlans()}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-primary mr-4 transition-colors duration-200">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Business Plans</h1>
        </div>
      </div>
      
      {/* Plans Section */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Tariff Plans for Business Profiles
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Select a plan that suits your business needs and enhance your visibility 
            on our platform with premium features.
          </p>
          
          {/* Period Selection */}
          <div className="mb-12">
            <div className="text-gray-700 font-medium mb-4">Select billing period:</div>
            <PeriodSelectGrid 
              selected={selectedPeriod}
              onSelect={setSelectedPeriod}
              list={periodOptions}
            />
          </div>
          
          {/* Current Period Info */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-primary rounded-full mb-10 border border-blue-100">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">
              Selected period: {periodOptions.find(p => p.value === selectedPeriod)?.title}
            </span>
          </div>
        </div>
        
        {/* Plan List */}
        <div className="space-y-10">
          {businessPlans.map((plan) => (
            <PlanContainer 
              key={plan.id} 
              businessPlan={plan} 
              selectedPeriod={selectedPeriod}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
        
        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white p-6 rounded-xl shadow-md max-w-md">
            <h3 className="text-lg font-semibold mb-2">Need help choosing?</h3>
            <p className="text-gray-600 mb-4">
              Contact our team for personalized assistance in selecting the right business plan for your needs.
            </p>
            <a 
              href="#contact" 
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Contact support
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlansPage;