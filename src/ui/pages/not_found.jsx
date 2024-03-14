
import React from 'react';

const NotFound = () => {
    return (
        <div
            className="flex flex-col w-[100%] justify-content-center items-center gap-5"
            style={{ height: '100vh' }}
        >
            <h1
                className="text-5xl font-bold"
            >
                404 ничего не найдено
            </h1>
            <p>Эта страница возможно недоступна или удалена</p>
        </div>
    );
};

export default NotFound;
