import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
    Select,
    notification
} from 'antd';
import { setBussinessSettings } from "../../../api/bussiness";
import { userDetails } from "../../../api/user";
import Navbar from "../../components/navbar";
import DragAndDropUploader from "../../components/drag_and_drop_uploader";

const { Option } = Select

const BusinessProfileSettings = () => {
    const history = useNavigate();
    const [planId, setPlanId] = useState();
    const [loading, setLoading] = useState(false);
    const [logotype, setLogotype] = useState();
    const [cover, setCover] = useState();
    const [location, setLocation] = useState();
    const [user, setUser] = useState();
    const [schedule, setSchedule] = useState({
        monday: { selected: false },
        tuesday: { selected: false },
        wednesday: { selected: false },
        thursday: { selected: false },
        friday: { selected: false },
        saturday: { selected: false },
        sunday: { selected: false }
    })

    //2gis map
    var DG = require('2gis-maps');
    var map;
    var marker;
    var lat, lng;
    const fetchUserDetails = async () => {
        const userDetail = await userDetails();
        if (userDetail != null) {
            console.table("user detail", userDetail);
            setPlanId(userDetail.business_account.id);
            setUser(userDetail);
            setLocation(JSON.parse(userDetail.business_account.location));
            const data = {
                name: userDetail.business_account.name,
                description: userDetail.business_account.description,
                email: userDetail.business_account.email,
                site: userDetail.business_account.site,
                whatsapp: userDetail.business_account.whatsapp,
                address: userDetail.business_account.address,
                phones: JSON.parse(userDetail.business_account.phones),
                facebook: JSON.parse(userDetail.business_account.socials).facebook,
                instagram: JSON.parse(userDetail.business_account.socials).instagram,
                telegram: JSON.parse(userDetail.business_account.socials).telegram,
                schedules: JSON.parse(userDetail.business_account.schedule)
            };
            console.log('data', data);
            form.setFieldsValue({
                ...data,
            });
            // console.log(form);
        }
        else {
            console.log("Fetch user details error!");
        }
    }

    if (location != null) {
        // 2gis map 
        DG.then(function () {
            map = DG.map('map', {
                'center': [location.latitude, location.longitude],
                'zoom': 13
            });
            marker = DG.marker([location.latitude, location.longitude], {
                draggable: true
            }).addTo(map);
            marker.on('drag', function (e) {
                lat = e.target._latlng.lat.toFixed(3);
                lng = e.target._latlng.lng.toFixed(3);
                // console.log("lat:"+lat,"lng:"+lng);
                setLocation({ latitude: lat, longitude: lng });
            });
        });
    }

    useEffect(() => {
        fetchUserDetails();
    }, [])

    const [form] = Form.useForm();
    const [phoneOptions, setPhoneOptions] = useState([]);
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    function _setSchedule(key, value) {
        setSchedule(prev => ({
            ...prev,
            [key]: { ...prev[key], ...value }
        }))
    }

    function _setScheduleSelected(key, value) {
        setSchedule(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: value }
        }))
    }

    const onFinish = async (values) => {
        const isValid = await form.validateFields();
        if (isValid) {
            const formData = new FormData();
            formData.append('logotype', logotype);
            formData.append('cover', cover);
            formData.append('schedule', JSON.stringify(schedule));
            formData.append('location', JSON.stringify(location));
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
            formData.append('_method', 'PATCH')
            setLoading(true)
            const response = await setBussinessSettings(planId, formData)
            console.log(response)
            if (response != null) {
                notification['success']({
                    message: 'Успешно сохранено!',
                });
                history(`/profile`);
            } else {
                notification['error']({
                    message: 'Не удалось сохранить!',
                });
                console.log("location", location);
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
                загрузить
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
                        <h5>Настройки бизнес профиля</h5>
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
                                <Input placeholder="название компании или название бизнеса" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Описание"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Описание пусто!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.TextArea placeholder="описание" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Неправильно введен еmail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Email пусто!',
                                    },
                                ]}
                            >
                                <Input placeholder="email" />
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
                                <Input placeholder="сайт" />
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
                                <Input placeholder="адрес" />
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
                                <Input placeholder="996555555555 в таком формате" />
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
                                <Input placeholder="ссылка на Facebook страницу" />
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
                                <Input placeholder="ссылка на instagram страницу" />
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
                                <Input placeholder="ссылка на telegram" />
                            </Form.Item>
                            <Form.Item
                                name="schedules"
                                label="График работы"
                            // rules={[
                            //     {
                            //         message: 'График работы пусто!',
                            //     },
                            // ]}
                            >
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Пн"} onChange={(e) => {
                                        _setScheduleSelected('monday', e.target.checked)
                                    }} />&nbsp;Пн</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('monday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('monday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Вт"} onChange={(e) => {
                                        _setScheduleSelected('tuesday', e.target.checked)
                                    }} />&nbsp;Вт</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('tuesday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('tuesday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Ср"} onChange={(e) => {
                                        _setScheduleSelected('wednesday', e.target.checked)
                                    }} />&nbsp;Ср</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('wednesday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('wednesday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Чт"} onChange={(e) => {
                                        _setScheduleSelected('thursday', e.target.checked)
                                    }} />&nbsp;Чт</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('thursday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('thursday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Пт"} onChange={(e) => {
                                        _setScheduleSelected('friday', e.target.checked)
                                    }} />&nbsp;Пт</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('friday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('friday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col span={2}><Checkbox value={"Сб"} onChange={(e) => {
                                        _setScheduleSelected('saturday', e.target.checked)
                                    }} />&nbsp;Сб</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('saturday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('saturday', { endTime: e.target.value }) }} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={2}><Checkbox value={"Вс"} onChange={(e) => {
                                        _setScheduleSelected('sunday', e.target.checked)
                                    }} />&nbsp;Вс</Col>
                                    &nbsp;
                                    <Col span={12} xs={12} lg={12}>
                                        <input type="time" onChange={(e) => { _setSchedule('sunday', { startTime: e.target.value }) }} /> : <input type="time" onChange={(e) => { _setSchedule('sunday', { endTime: e.target.value }) }} />
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
                                        setCover(null);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <p>Местоположение</p>
                                <div id="map" style={{ width: "100%", height: "400px" }}></div>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Сохранить изменения
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

export default BusinessProfileSettings;