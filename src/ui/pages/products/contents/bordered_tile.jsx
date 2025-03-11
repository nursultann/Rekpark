import React from 'react';

const BorderedTile = ({ title, children }) => {
    return (
        <div className="px-[21px] py-[10px] rounded-[10px] border border-neutral-200 justify-start items-center gap-2.5 text-lg  font-['SF UI Display']">
            <span className='text-blue-600 inline mr-2.5'>{title}</span>
            {children}
        </div>
    );
};
export default BorderedTile;
