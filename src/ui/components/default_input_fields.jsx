import React from 'react';

const DefaultInput = ({ className, value, onChange, allowClear, type = 'text', placeholder, disabled }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className={`relative flex flex-row items-center justify-center ${className}`}>
            <input
                type={type}
                value={value}
                onChange={handleChange}
                className='border rounded-[10px] px-[20px] w-full'
                placeholder={placeholder}
                disabled={disabled}
            />

            {allowClear && value && (
                <div className='absolute right-[10px]'>
                    <button
                        type='button'
                        onClick={() => onChange('')}
                        className='ml-[10px] text-[#999999] hover:text-[#666666] transition-colors duration-200'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10 1a9 9 0 100 18 9 9 0 000-18zm4.95 11.364a.682.682 0 01-.965.965L10 10.965l-4.95 4.364a.682.682 0 01-.965-.965L9.035 10 4.09 5.636a.682.682 0 01.965-.965L10 9.035l4.95-4.364a.682.682 0 01.965.965L10.965 10l4.95 4.364z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

const DefaultSelect = ({ className, value, onChange, placeholder, disabled, multiple, children }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className={`relative flex flex-row items-center justify-center ${className}`}>
            <select
                value={value}
                onChange={handleChange}
                className='border rounded-[10px] px-[20px] py-[13px] w-full'
                placeholder={placeholder}
                disabled={disabled}
                multiple={multiple}
            >
                {children}
            </select>
        </div>
    );
};


export { DefaultInput, DefaultSelect };
