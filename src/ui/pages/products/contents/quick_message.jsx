import React, { useState } from 'react';
import { notification } from 'antd';

function QuickMessages({ messageSendHandler }) {
    const [message, setMessage] = useState("")

    const postMessage = async () => {
        messageSendHandler(message)
        setMessage("")
    }

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow" id="chatbox">
            {/* Message input area with fixed text color */}
            <div className="p-4">
                <textarea
                    id="message"
                    rows="5"
                    className="block w-full text-black bg-white border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Написать что-нибудь"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ color: 'black' }} /* Inline style as a fallback to ensure text visibility */
                ></textarea>
            </div>

            {/* Buttons section */}
            <div className="px-4 pb-4">
                {/* Primary send button */}
                <button
                    type="button"
                    onClick={postMessage}
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 py-3.5 mb-4 flex justify-center items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Отправить
                </button>

                {/* Quick reply buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => messageSendHandler("Еще актуально?")}
                        className="px-4 py-2.5 text-orange-500 bg-white border border-orange-500 hover:bg-orange-50 font-medium rounded-lg flex justify-center items-center dark:text-orange-400 dark:border-orange-400 dark:hover:bg-gray-700"
                    >
                        Еще актуально?
                    </button>

                    <button
                        type="button"
                        onClick={() => messageSendHandler("Обмен интересует?")}
                        className="px-4 py-2.5 text-orange-500 bg-white border border-orange-500 hover:bg-orange-50 font-medium rounded-lg flex justify-center items-center dark:text-orange-400 dark:border-orange-400 dark:hover:bg-gray-700"
                    >
                        Обмен интересует?
                    </button>

                    <button
                        type="button"
                        onClick={() => messageSendHandler("Торг возможен?")}
                        className="px-4 py-2.5 text-orange-500 bg-white border border-orange-500 hover:bg-orange-50 font-medium rounded-lg flex justify-center items-center dark:text-orange-400 dark:border-orange-400 dark:hover:bg-gray-700"
                    >
                        Торг возможен?
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuickMessages