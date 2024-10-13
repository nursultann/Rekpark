import React from 'react';

const RoundedButton = ({ onClick, disabled, className, children }) => {
    return (
        <div className={className}>
            <div
                className="w-10 h-10 p-2.5 rounded-[15px] border border-zinc-100 justify-center items-center inline-flex cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                onClick={onClick}
            >
                {children}
            </div>
        </div>
    );
};


export default RoundedButton;
