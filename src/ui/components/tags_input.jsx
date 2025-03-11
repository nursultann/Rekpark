
import { CloseCircleFilled } from '@ant-design/icons';
import { CloseRounded } from '@mui/icons-material';
import React, { useState } from 'react';

function TagsRow({ tags, handleRemoveTag }) {
    return (
        <div className='flex flex-row items-center  mx-2'>
            <ul className='flex flex-wrap  gap-2 w-full items-center '>
                {tags?.map((tag, index) => (
                    <li key={index} className='flex flex-row items-center px-[10px] py-[5px] bg-[#F0F0F0] rounded-[10px]'>
                        {tag}
                        <button
                            type='button'
                            onClick={() => handleRemoveTag(tag)}
                            className='ml-1 text-[#999999] hover:text-[#666666] transition-colors duration-200'

                        >
                            <CloseRounded style={{ fontSize: '15px' }} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TagsInput({ options, values, onChange, placeholder, className }) {
    const [optionsListVisible, setOptionsListVisible] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const newTag = event.target.value.trim();
            if (newTag !== '' && !values.includes(newTag)) {
                onChange([...values, newTag]);
                event.target.value = '';
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        onChange(values.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className={`flex flex-col ${className}`}>

            <div className={`flex flex-wrap border rounded-[10px] w-full py-[5px]`}>
                <TagsRow tags={values} handleRemoveTag={handleRemoveTag} />
                <input
                    type="text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className='border-none bg-transparent hover:border-none focus:border-none active:border-none rounded-2xl focus:ring-0'
                    style={{ border: 'none' }}
                    onFocus={() => setOptionsListVisible(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setOptionsListVisible(false);
                        }, 200);
                    }}
                />
            </div>
            {options && options.length > 0 && (
                <div className={`flex flex-col gap-2 mt-2 ${optionsListVisible ? 'opacity-100 h-full' : 'opacity-0 h-0'} transition duration-200 transform-gpu ease-in-out`}>
                    <div className='flex flex-col gap-2 w-full bg-white rounded-[10px] p-2 shadow-md'>
                        {options.map((option) => (
                            <button
                                key={option}
                                type='button'
                                onClick={() => {
                                    console.log(values.includes(option), option);
                                    if (!values.includes(option)) {

                                        onChange([...values, option]);
                                    }
                                    setOptionsListVisible(false);
                                }}
                                className='flex flex-row  px-[10px] py-[5px] rounded-[10px] hover:bg-[#E9E9E9] transition-colors duration-200'
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default TagsInput;
