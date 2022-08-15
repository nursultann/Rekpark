import { useState } from "react";
import { useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from 'antd';
// import { DG } from 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
const { Option } = Select;
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
};
const BussinessPlan = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [form] = Form.useForm();
    const param = useParams();
    const planId = param.id;
    const periodId = param.period;
    const [phoneOptions, setPhoneOptions] = useState([]);
    console.log("planId", planId, "periodId", periodId);
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="+996">+996</Option>
                <Option value="+7">+7</Option>
            </Select>
        </Form.Item>
    );
    const Hours = () => {
        let text = [];
        for (let i = 0; i < 24; i++) {
            text[i] = <Option value={i}>{i}</Option>;
        }
        const hour = text;
        return (
            <Select defaultValue={0}>
                {hour.map((i) =>
                    <>
                        {i}
                    </>
                )}
            </Select>
        );
    };
    const Minutes = () => {
        let text = [];
        for (let i = 0; i < 60; i++) {
            text[i] = <Option value={i}>{i}</Option>;
        }
        const min = text;
        return (
            <Select defaultValue={0}>
                {min.map((i) =>
                    <>
                        {i}
                    </>
                )}
            </Select>
        );
    };
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    const onWebsiteChange = (value) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));
    // var map;

    // DG.then(function () {
    //   map = DG.map('map', {
    //     center: [54.98, 82.89],
    //     zoom: 13
    //   });
    //   DG.marker([54.98, 82.89]).addTo(map);
    // });
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <h5>Регистрация бизнес профиля - Заполните поля*</h5>
                        <hr />
                    </div>
                    <div className="col-2"></div>
                    <div className="col-12 col-md-8 mt-3 mb-3">
                        <Form
                            layout="vertical"
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="name"
                                label="Название компании или название бизнеса"
                                rules={[
                                    {
                                        type: 'text',
                                    },
                                    {
                                        required: true,
                                        message: 'Название пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Описание"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="site"
                                label="Сайт"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Сайт пусто!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Адрес"
                                rules={[
                                    {
                                        type: 'text',
                                        required: true,
                                        message: 'Адрес пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                key="phones"
                                label="Телефон"
                                name="phones"
                                rules={[{ required: true, message: 'Введите телефон!' }]}
                            >
                                <Select mode="tags" placeholder="Введите телефон" tokenSeparators={[',']}>
                                    {phoneOptions}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="whatsapp"
                                label="Whats App"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Whats App пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="facebook"
                                label="Facebook ссылка"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Facebook ссылка пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="instagram"
                                label="Instagram ссылка"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Instagram ссылка пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="telegram"
                                label="Telegram ссылка"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Telegram ссылка пусто!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="schedules"
                                label="График работы"
                                rules={[
                                    {
                                        required: true,
                                        message: 'График работы пусто!',
                                    },
                                ]}
                            >
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Пн"} />&nbsp;Пн</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Вт"} />&nbsp;Вт</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Ср"} />&nbsp;Ср</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Чт"} />&nbsp;Чт</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Пт"} />&nbsp;Пт</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Сб"} />&nbsp;Сб</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={2}><Checkbox value={"Вс"} />&nbsp;Вс</Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                    &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Hours />
                                    </Col>&nbsp; : &nbsp;
                                    <Col span={2} xs={4} lg={2}>
                                        <Minutes />
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <p>Логотип</p>
                                <Upload
                                    name="logotype"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="logo"
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <p>Баннер</p>
                                <Upload
                                    name="banner"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="logo"
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <p>Местоположение</p>
                                <div id="map" style={{ width: "100%", height: "400px" }}></div>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Зарегистрировать бизнес аккаунт
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        </>
    );
}
export default BussinessPlan;