import { KeyboardArrowDown } from '@mui/icons-material';
import classNames from 'classnames';
import React from 'react';
import { useClickAway } from 'react-use';

const DefaultInput = ({
    name,
    className,
    value,
    onChange,
    allowClear,
    type = 'text',
    placeholder,
    disabled,
    required,
    error
}) => {
    const handleChange = (e) => {
        if (onChange) onChange(e);
    };

    return (
        <div>
            <div className={`relative flex flex-row items-center justify-center ${className}`}>
                <input
                    name={name}
                    id={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    className={classNames('border rounded-[10px] px-[20px] w-full', {
                        'bg-[#f5f5f5]': disabled,
                        'bg-white': !disabled,
                        'border-[#999999]': !error,
                        'border-[#ff0000]': error,
                        'text-[#999999]': !value,
                        'text-[#666666]': value,
                    })}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
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
            {error && <div className='text-[12px] mt-[5px]'
                style={{
                    color: 'rgba(255, 0, 0, 0.8)'
                }}
            >{error}</div>}
        </div>
    );
};

const DefaultSelect = ({ name, className, value, onChange, placeholder, disabled, multiple, children }) => {
    const handleChange = (e) => {
        if (onChange) onChange(e);
    };

    return (
        <div className={`relative flex flex-row items-center justify-center ${className}`}>
            <select
                name={name}
                id={name}
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

const SearchableSelect = ({ name, className, value, onChange, placeholder, disabled, multiple, options }) => {
    const [showOptions, setShowOptions] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const ref = React.useRef();

    const handleChange = (e) => {
        if (onChange) onChange(e);
    };

    useClickAway(ref, () => {
        setShowOptions(false);
    })

    const getLabel = (value) => {
        const option = options.find((item) => item.value === value);
        return option ? option.label : '';
    }

    return (
        <div className={`relative flex flex-row items-center justify-center ${className}`} ref={ref}>
            <div
                id={name}
                className={classNames(
                    'border rounded-[10px] px-[20px] py-[13px] w-full cursor-pointer',
                    'hover:border-[#666666] transition-colors duration-200',
                    'active:border-[#666666] flex items-center justify-between',
                    {
                        'text-[#999999]': !value,
                        'text-[#666666]': value,
                        'text-[#999999]': disabled,
                        'text-[#666666]': !disabled,

                    },
                )}
                onClick={() => setShowOptions(!showOptions)}
            >
                {value ? getLabel(value) : placeholder}
                <KeyboardArrowDown
                    className={classNames(
                        'ml-[10px] text-[#999999] hover:text-[#666666] transition-transform duration-200',
                        {
                            'transform rotate-180': showOptions,
                        },
                    )}
                />
            </div>


            <div className={classNames(
                'absolute top-[calc(100%+10px)] left-0 w-full bg-white border rounded-[10px] shadow-md',
                'overflow-y-auto max-h-[300px] z-10 transition-all duration-200',
                {
                    'opacity-0 pointer-events-none': !showOptions,
                    'opacity-100 pointer-events-auto': showOptions,
                    'shadow-md': showOptions,
                },
            )}>
                {options && options.length > 5 && (
                    <div className='px-[20px] py-[13px]'>
                        <DefaultInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search...'
                        />
                    </div>
                )}

                {!options || options.length === 0 ? (
                    <div className='px-[20px] py-[13px]'>
                        <div className='text-[#999999]'>{placeholder}</div>
                    </div>
                ) : options.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())).map((item, index) => (
                    <div
                        key={index}
                        className={classNames(
                            'px-[20px] py-[13px] cursor-pointer',
                            'hover:bg-[#f5f5f5] transition-colors duration-200',
                            'active:bg-[#f5f5f5]',
                            {
                                'text-[#999999]': !value,
                                'text-[#666666]': value,
                                'text-[#999999]': disabled,
                                'text-[#666666]': !disabled,
                                'bg-[#f5f5f5]': item.value === value,

                            },
                        )}
                        onClick={() => {
                            setShowOptions(false);
                            handleChange(item.value);
                            setSearch('');
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </div>

        </div>
    );
};


export { DefaultInput, DefaultSelect, SearchableSelect };
