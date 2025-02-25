import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CustomTooltip = ({ 
  children, 
  content, 
  position = 'bottom', 
  trigger = 'hover',
  maxWidth = 'auto',
  maxHeight = 'auto',
  className = '',
  isOpen: controlledIsOpen,
  onClose,
  showArrow = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [arrowCoords, setArrowCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Use controlled state if provided
  const tooltipIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  // Calculate position
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;
    let arrowPosition = position;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 12;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        arrowTop = tooltipRect.height;
        arrowLeft = tooltipRect.width / 2 - 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + 12;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        arrowTop = -8;
        arrowLeft = tooltipRect.width / 2 - 8;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 12;
        arrowTop = tooltipRect.height / 2 - 8;
        arrowLeft = tooltipRect.width;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 12;
        arrowTop = tooltipRect.height / 2 - 8;
        arrowLeft = -8;
        break;
      default:
        top = triggerRect.bottom + 12;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        arrowTop = -8;
        arrowLeft = tooltipRect.width / 2 - 8;
    }
    
    // Ensure tooltip stays within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Adjust horizontal position if needed
    if (left < 10) {
      const shift = 10 - left;
      left = 10;
      
      // Adjust arrow position to still point to the trigger
      if (position === 'top' || position === 'bottom') {
        arrowLeft -= shift;
      } else if (position === 'left') {
        // If too close to left edge, might need to flip to right
        if (triggerRect.left < tooltipRect.width + 20) {
          left = triggerRect.right + 12;
          arrowPosition = 'right';
          arrowLeft = -8;
        }
      }
    } else if (left + tooltipRect.width > viewport.width - 10) {
      const shift = (left + tooltipRect.width) - (viewport.width - 10);
      left = viewport.width - tooltipRect.width - 10;
      
      // Adjust arrow position
      if (position === 'top' || position === 'bottom') {
        arrowLeft += shift;
      } else if (position === 'right') {
        // If too close to right edge, might need to flip to left
        if (triggerRect.right + tooltipRect.width > viewport.width - 20) {
          left = triggerRect.left - tooltipRect.width - 12;
          arrowPosition = 'left';
          arrowLeft = tooltipRect.width;
        }
      }
    }
    
    // Adjust vertical position if needed
    if (top < 10) {
      const shift = 10 - top;
      top = 10;
      
      // Adjust arrow position
      if (position === 'left' || position === 'right') {
        arrowTop -= shift;
      } else if (position === 'top') {
        // If too close to top edge, might need to flip to bottom
        if (triggerRect.top < tooltipRect.height + 20) {
          top = triggerRect.bottom + 12;
          arrowPosition = 'bottom';
          arrowTop = -8;
        }
      }
    } else if (top + tooltipRect.height > viewport.height - 10) {
      const shift = (top + tooltipRect.height) - (viewport.height - 10);
      top = viewport.height - tooltipRect.height - 10;
      
      // Adjust arrow position
      if (position === 'left' || position === 'right') {
        arrowTop += shift;
      } else if (position === 'bottom') {
        // If too close to bottom edge, might need to flip to top
        if (triggerRect.bottom + tooltipRect.height > viewport.height - 20) {
          top = triggerRect.top - tooltipRect.height - 12;
          arrowPosition = 'top';
          arrowTop = tooltipRect.height;
        }
      }
    }
    
    setCoords({ top, left });
    setArrowCoords({ top: arrowTop, left: arrowLeft, position: arrowPosition });
  };
  
  // Event handlers
  const handleOpen = () => {
    if (controlledIsOpen === undefined) {
      setIsOpen(true);
    }
  };
  
  const handleClose = () => {
    if (controlledIsOpen === undefined) {
      setIsOpen(false);
    } else if (onClose) {
      onClose();
    }
  };
  
  // Click outside handler
  useEffect(() => {
    if (!tooltipIsOpen) return;
    
    const handleClickOutside = (e) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipIsOpen]);
  
  // Update position when tooltip opens or window resizes
  useEffect(() => {
    if (tooltipIsOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [tooltipIsOpen]);
  
  // Handle trigger type
  const triggerProps = trigger === 'hover' 
    ? {
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose
      }
    : {
        onClick: (e) => {
          e.preventDefault();
          if (tooltipIsOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }
      };
  
  // Arrow styles based on position
  const getArrowStyles = () => {
    const { position } = arrowCoords;
    
    switch (position) {
      case 'top':
        return {
          borderTop: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))',
        };
      case 'bottom':
        return {
          borderBottom: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          filter: 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1))',
        };
      case 'left':
        return {
          borderLeft: '8px solid white',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          filter: 'drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1))',
        };
      case 'right':
        return {
          borderRight: '8px solid white',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          filter: 'drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.1))',
        };
      default:
        return {
          borderBottom: '8px solid white',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          filter: 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1))',
        };
    }
  };
  
  return (
    <>
      <div ref={triggerRef} {...triggerProps} className="inline-block">
        {children}
      </div>
      
      {tooltipIsOpen && createPortal(
        <div 
          ref={tooltipRef}
          className={`fixed z-50 bg-white shadow-lg rounded-lg overflow-hidden transition-opacity duration-200 ${className}`}
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left}px`,
            maxWidth,
            maxHeight,
            opacity: tooltipIsOpen ? 1 : 0,
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {content}
          
          {/* Arrow element */}
          {showArrow && (
            <div
              className="absolute w-0 h-0"
              style={{
                top: `${arrowCoords.top}px`,
                left: `${arrowCoords.left}px`,
                ...getArrowStyles()
              }}
            />
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default CustomTooltip;