import React from "react";
import Navbar from "../../components/navbar";
import { userDetails, userSettings } from "../../../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/actions/user_actions";
import { Button } from "@mui/material";
import { setProducts } from "../../../redux/actions/product_actions";
import * as api from "../../../api";
import { Tabs } from 'antd';
import { Input } from 'antd';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const key = 'updatable';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const SettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageurl] = useState();
    const [name, setName] = useState();
    const [userid, setUserid] = useState();
    const [file, setFile] = useState();

    function beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }

        setFile(file);
        getBase64(file, function (result) {
            setImageurl(result);
        });

        return false;
    }

    const handleChange = (info) => { }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Загрузить аватар</div>
        </div>
    );

    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
            setUserid(user.id);
        }
    };

    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true });
        if (_products != null) {
            dispatch(setProducts(_products));
            setOffset(offset + limit);
        }
    };

    const saveSettings = async () => {
        const formData = new FormData();
        if (name != null) {
            if (name.length > 4) {
                formData.append('name', name);
            } else {
                message.error('Имя не может быть короче 4 символов', 10);
                return;
            }

        }
        if (file != null) {
            formData.append('avatar', file);
        }
        if (name != null || file != null) {
            formData.append('_method', 'PATCH');
            message.loading({ content: 'Загрузка...', key });
            const result = await userSettings(formData, userid, function (data) {
                fetchUserDetails();
                setTimeout(() => {
                    message.success({ content: 'Успешно!', key, duration: 2 });
                }, 1000);
                // window.location.href = '/profile';
            }, function (data) {
                console.log("Error");
            });
        }
    }
    document.title = "Настройки пользователя";
    useEffect(() => {
        fetchUserDetails();
        UserProducts();
    }, []);

    return (
        <div className="col-12 bg-[#F4F4F4] py-[60px] flex flex-col items-center justify-center justify-items-center rounded-2xl">
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>

            <Input
                className="form-control mt-3 border-0"
                defaultValue={user != null ? user.name : ""}
                placeholder="Имя"
                onChange={(e) => { setName(e.target.value) }}
            />
            <Button className="col-12 rounded mt-3" type="primary" onClick={saveSettings}>Сохранить изменения</Button>
        </div>
    );
}

export default SettingsPage;