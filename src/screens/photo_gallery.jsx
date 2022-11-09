import React, {useState} from "react";
import DragAndDropUploader from "../components/drag_and_drop_uploader";
import Navbar from "../components/navbar";
import {Button, Form, notification} from "antd";
import {useEffectOnce} from "react-use";
import {sendPhotoGallery} from "../api/bussiness";
import {useHistory} from "react-router-dom";

const Gallery = () => {
    const history = useHistory();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false)

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const send = async () => {
        if (files) {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images[]', file);
            });

            setLoading(true)
            const response = await sendPhotoGallery(formData)
            setLoading(false)
            if (response != null && response.success) {
                openNotification('success', 'Успешно сохранено!', null);
            } else {
                openNotification('error', 'Не удалось сохранить!', null);
            }
        }
    }

    return (
        <div>
            <Navbar/>
            <div className="col-12 py-3">
                <div className="col-12 text-center py-3">
                    <h4>Добавление фото для галереи бизнес профиля</h4>
                    <Form.Item>
                        <p>Логотип</p>
                        <center>
                            <DragAndDropUploader
                                className="mb-3 p-2"
                                style={{maxWidth: 500}}
                                onChange={(file) => {
                                    setFiles([...files, file]);
                                }}
                                onRemove={(f) => {
                                    const index = files.indexOf(f);
                                    if (index !== -1) {
                                        const f = files.splice(index, 1);
                                        setFiles(f);
                                    }
                                }}
                            />
                        </center>
                        <center>
                            <Button
                                className="btn mt-4"
                                style={{ backgroundColor: '#184d9f', color: "#fff" }}
                                loading={loading}
                                onClick={send}
                            >
                                Опубликовать
                            </Button>
                        </center>
                    </Form.Item>
                </div>
            </div>
        </div>
    );
}
export default Gallery;