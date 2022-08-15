import { useState } from "react";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
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
    notification
} from 'antd';
// import { DG } from 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
import Navbar from "../components/navbar";
import DragAndDropUploader from "../components/drag_and_drop_uploader";
import { setBussinessPlan } from "../api/bussiness";

const { Option } = Select;

const BusinessPlan = () => {
    const history = useHistory();
    const param = useParams();
    const planId = param.id;
    const periodId = param.period;

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [logotype, setLogotype] = useState();
    const [cover, setCover] = useState();
    const [form] = Form.useForm();
    const [phoneOptions, setPhoneOptions] = useState([]);
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    const onFinish = async (values) => {
        const isValid = await form.validateFields();
        if (isValid) {
            const formData = new FormData();
            formData.append('plan_id', planId);
            formData.append('period_id', periodId);
            formData.append('logotype', logotype);
            formData.append('cover', cover);
            for (const key of Object.keys(values)) {
                formData.append(key, values[key])
            }
            if (values['instagram'] || values['facebook'] || values['telegram']) {
                formData.append('socials', JSON.stringify({
                    'instagram': values['instagram'],
                    'facebook': values['facebook'],
                    'telegram': values['telegram'],
                }))
            }
            formData.append('phones', JSON.stringify(values['phones']))

            setLoading(true)
            const response = await setBussinessPlan(formData)
            console.log(response)
            if (response != null) {
                notification['success']({
                    message: 'Успешно сохранено!',
                });
                history.push(`/profile`);
            } else {
                notification['error']({
                    message: 'Не удалось сохранить!',
                });
            }
            setLoading(false)
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
            text[i] = <Option value={i} key={i}>{i}</Option>;
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
            text[i] = <Option value={i} key={i}>{i}</Option>;
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
                                <DragAndDropUploader
                                    multiple={false}
                                    onChange={(file) => {
                                        setLogotype(file);
                                    }}
                                    onRemove={(f) => {
                                        setLogotype(null)
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <p>Баннер</p>
                                <DragAndDropUploader
                                    multiple={false}
                                    onChange={(file) => {
                                        setCover(file);
                                    }}
                                    onRemove={(f) => {
                                        setCover(null)
                                    }}
                                />
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

export default BusinessPlan;