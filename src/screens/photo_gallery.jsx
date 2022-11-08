import { useState } from "react";
import DragAndDropUploader from "../components/drag_and_drop_uploader";
import Navbar from "../components/navbar";
import {Form} from "antd";
const Gallery = () => {
    const [files, setFiles] = useState([]);
    return (
        <div>
            <Navbar />
            <div className="col-12 py-3">
                <div className="col-12 text-center py-3">
                    <h4>Добавление фото для галереи бизнес профиля</h4>
                    <Form.Item>
                        <p>Логотип</p>
                        <center>
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
                        </center>
                    </Form.Item>
                </div>
            </div>
        </div>
    );
}
export default Gallery;