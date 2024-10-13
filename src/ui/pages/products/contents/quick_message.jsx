import React, { useState } from 'react';
import { notification } from 'antd';

function QuickMessages({ messageSendHandler }) {
    const [message, setMessage] = useState("")

    const postMessage = async () => {
        messageSendHandler(message)
        setMessage("")
    }

    return (
        <div className="col-xl-12 mt-2 px-0">
            <textarea rows="10"
                className="form-control"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                placeholder="Написать что-нибудь"
            ></textarea>
            <div className="flex flex-col gap-2 justify-center items-center mt-2 text-white">
                <button
                    className="rounded-xl w-full btn btn-primary text-white"
                    onClick={postMessage}
                >
                    Отправить
                </button>
                <button className="btn btn-warning rounded-xl w-full" onClick={() => messageSendHandler("Еще актуально?")}>
                    Еще актуально?
                </button>
                <button className="btn btn-warning rounded-xl w-full" onClick={() => messageSendHandler("Обмен интересует?")}>
                    Обмен интересует?
                </button>
                <button className="btn btn-warning rounded-xl w-full" onClick={() => messageSendHandler("Торг возможен?")}>
                    Торг возможен?
                </button>
            </div>
        </div>
    )
}

export default QuickMessages