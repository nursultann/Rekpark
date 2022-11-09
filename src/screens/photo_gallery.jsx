import { useState } from "react";
import DragAndDropUploader from "../components/drag_and_drop_uploader";
import Navbar from "../components/navbar";
import {Button, Form, notification} from "antd";
import { uploadGallery } from "../api/bussiness";
import { useHistory } from "react-router-dom";
const Gallery = () => {
    const history = useHistory();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onSend = async (model) =>{
            const valid = await form.validateFields();
            if (valid) {
                const formData = new FormData();
                model.files.forEach(file => {
                    formData.append('images[]', file);
                });
                for (const [key, value] of Object.entries(form.getFieldsValue())) {
                    formData.append(`${key}`, value);
                }
                setLoading(true);
                const response = await uploadGallery(formData);
                if (response != null && response.success) {
                    openNotification('success', 'Успешно сохранено!', null);
                    console.log();
                    history.push(`/`);
                } else {
                    openNotification('error', 'Не удалось сохранить!', null);
                }
                setLoading(false);
            }
    }
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };
    return (
        <div>
            <Navbar />
            <div className="col-12 py-3">
                <div className="col-12 py-3">
                   
                    <center>
                    <Form
                        form={form}
                        name="product_create"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onSend={onSend(form)}
                    >
                    <Form.Item>
                            <h5>Добавление фото для галереи бизнес профиля</h5>
                            <p>Загрузите фото для галереи бизнес аккаунта</p>
                            <DragAndDropUploader
                                className="mb-3 p-2"
                                style={{ maxWidth: 500 }}
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
                            <Button type="primary" loading={loading} onClick={onSend(form)}>Загрузить</Button>
                    </Form.Item>
                   
                    </Form>
                    </center>
                </div>
            </div>
        </div>
    );
}
export default Gallery;