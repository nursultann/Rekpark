import React from "react";
import { userDetails, userSettings } from "../../../api/user";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/actions/user_actions";
import { Button } from "@mui/material";
import { setProducts } from "../../../redux/actions/product_actions";
import * as api from "../../../api";
import { Tabs } from 'antd';
import { message } from 'antd';
import { EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffectOnce } from "react-use";
import ProfileImage from "./components/profile_image";
import { useUserStore } from "../../../store/user_store";

import editRect from "../../../dist/icons/edit-rect.svg";
import { Phone } from "@mui/icons-material";

const { TabPane } = Tabs;
const key = 'updatable';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{6})$/);

    if (match) {
        return '+' + match[1] + ' ' + match[2] + ' ' + match[3]
    };

    return ""
}

const SettingsPage = () => {
    const userState = useUserStore();

    const user = userState.user;

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageurl] = useState();
    const [name, setName] = useState(user != null ? user.name : "");
    const [phone, setPhone] = useState(user != null ? user.phone : "");
    const [userid, setUserid] = useState();
    const [file, setFile] = useState();


    function beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }

        setFile(file);

        return false;
    }

    const dispatch = useDispatch();
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchUserProducts = async () => {
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
            setLoading(true);
            const result = await userSettings(formData, userid,
                function (data) {
                    setTimeout(() => {
                        message.success({ content: 'Успешно!', key, duration: 2 });
                    }, 1000);
                    setLoading(false);
                    userState.fetchUser()
                },
                function (data) {
                    console.log("Error");
                    setLoading(false);
                },
            );
        }
    }

    useEffectOnce(() => {
        document.title = "Настройки пользователя";
        fetchUserProducts();
    })


    return (
        <div className="col-12 bg-[#F4F4F4] py-[60px] flex flex-col items-center justify-center justify-items-center rounded-2xl">


            <center>
                <ProfileImage
                    image={user != null ? user.image : ""}
                    onChange={(file) => {
                        setFile(file);

                    }}
                />
            </center>

            <div
                className="mt-[40px] col-12"
                style={{
                    maxWidth: "540px",
                }}
            >
                <Input
                    label="Имя:"
                    placeholder="Введите имя"
                    value={name}
                    onChange={setName}
                />
                <div className="h-[20px]" />
                <Input
                    label={(
                        <div className="flex flex-row items-center">
                            <Phone />
                        </div>
                    )}
                    placeholder="Номер телефона"
                    value={formatPhoneNumber(phone)}
                    enabled={false}
                />

                <div className="h-[30px]" />

                <button
                    className="col-12 h-[60px] bg-blue-500 rounded-[15px] text-white font-bold text-[18px]"
                    type="primary"
                    onClick={saveSettings}
                >
                    {loading && <LoadingOutlined className="mr-4" />}
                    Сохранить изменения
                </button>

            </div>


        </div>
    );
}

function Input({ label, placeholder, value = "", onChange, enabled = true, className }) {
    return (
        <div className="flex flex-row justify-center items-center h-[60px] bg-white rounded-[15px] border border-neutral-200">
            <div
                className="col-3 flex items-center justify-center"
            >
                {label}
            </div>
            <input
                className=" border-0 h-full rounded-[15px] w-full focus:outline-none"
                placeholder={placeholder}
                value={value}
                onChange={(e) => { onChange(e.target.value) }}
                disabled={!enabled}
            />
            <img
                src={editRect}
                alt="edit"
                className="col-1 mr-2 p-0 "
                style={{
                    height: "20px",
                }}
            />

        </div>
    );
}

export default SettingsPage;