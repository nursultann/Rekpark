import { useState, useCallback, createContext, useContext } from 'react';

// Create a context for the toast functionality
const ToastContext = createContext(undefined);

// Generate a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

// Provider component that will wrap the application
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const toast = useCallback(
    ({ title, description, type = 'info', duration = 5000, variant = 'default' }) => {
      const id = generateId();
      
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, title, description, type, duration, variant },
      ]);

      // Auto-dismiss toast after duration
      if (duration !== Infinity) {
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  // Function to dismiss a specific toast
  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Function to dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to use the toast functionality
export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

// Toast Container Component
function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`p-4 rounded-md shadow-md animate-slide-in flex items-start ${
            toast.variant === 'destructive' 
              ? 'bg-red-600 text-white' 
              : toast.type === 'success'
              ? 'bg-green-600 text-white'
              : toast.type === 'warning'
              ? 'bg-yellow-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-white'
          }`}
          role="alert"
        >
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="mt-1 text-sm opacity-90">{toast.description}</p>}
          </div>
          <button 
            onClick={() => dismiss(toast.id)}
            className="ml-4 text-white opacity-70 hover:opacity-100"
            aria-label="Close toast"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// Add styles for animation
const styles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}
`;

// Create a style element and append to head if not already added
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  
  if (!document.head.querySelector('style[data-toast-styles]')) {
    styleElement.setAttribute('data-toast-styles', '');
    document.head.appendChild(styleElement);
  }
}

export default useToast;