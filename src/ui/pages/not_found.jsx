
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
                404 Not Found
            </h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;
