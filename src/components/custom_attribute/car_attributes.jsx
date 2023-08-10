import {Form, Input, Modal, Select} from "antd";
import React, {useState, useEffect, useRef} from "react";
import {useQuery} from "react-query";
import * as api from "../../api";
import {CircularProgress} from "@mui/material";

const filterObject = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== null && obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });

    return newObj;
}

export default function CarAttributes({ form }) {
    const [type, setType] = useState(form.getFieldValue('car_attributes.type_id') ?? 1);
    const [mark, setMark] = useState(form.getFieldValue('car_attributes.mark_id'));
    const [model, setModel] = useState(form.getFieldValue('car_attributes.model_id'));
    const [generation, setGeneration] = useState(form.getFieldValue('car_attributes.generation_id'));
    const [serie, setSerie] = useState(form.getFieldValue('car_attributes.series_id'));
    const [modification, setModification] = useState(form.getFieldValue('car_attributes.modification_id'));
    const [characteristics, setCharacteristics] = useState(form.getFieldValue('car_attributes.characteristics') ?? {});



    const types = useQuery(['types'], () => api.fetchCar('types'));
    const marks = useQuery(['marks', type], () => api.fetchCar('marks', {
        where: {
            car_type_id: type,
        },
        limit: 1000
    }));
    const models = useQuery(['models', type, mark], () => api.fetchCar('models', {
        where: filterObject({
            car_type_id: type,
            car_mark_id: mark
        }),
        limit: 1000
    }));
    const generations = useQuery(['generations', type, mark, model], () => api.fetchCar('generations', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model
        }),
        limit: 1000
    }));
    const series = useQuery(['series', type, mark, model, generation], () => api.fetchCar('series', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_generation_id: generation
        }),
        limit: 1000
    }));
    const modifications = useQuery(['modifications', type, mark, model, generation, serie], () => api.fetchCar('modifications', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_series_id: serie
        }),
        limit: 1000
    }));
    const characteristicsQuery = useQuery(['characteristics', type, mark, model,], () => api.fetchCar('characteristics', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_mark_id: mark,
        }),
        where_allow_null: true,
        limit: 1000,
        with_values: true
    }));

    return (
        <div>
            <Form.Item
                label="Тип"
                name="car_attributes.type_id"
                rules={[{ required: true, message: 'Выберите тип' }]}
            >
                <Select
                    value={type}
                    placeholder="Выберите тип"
                    onChange={(value) => {
                        setType(value);
                        setMark(null);
                        setModel(null);
                        setGeneration(null);
                        setSerie(null);
                        setModification(null);
                    }}
                >
                    {types.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            {type != null ?
            <Form.Item
                label="Марка"
                name="car_attributes.mark_id"
                rules={[{ required: true, message: 'Выберите марку' }]}
            >
                <Select
                    placeholder="Выберите марку"
                    value={mark}
                    onChange={(value) => {
                        setMark(value);
                        setModel(null);
                        setGeneration(null);
                        setSerie(null);
                        setModification(null);
                    }}
                >
                    {marks.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item> : null}
            {mark != null ? <Form.Item
                label="Модель"
                name="car_attributes.model_id"
                rules={[{ required: true, message: 'Выберите модель' }]}
            >
                <Select
                    placeholder="Выберите модель"
                    value={model}
                    onChange={(value) => {
                        setModel(value);
                        setGeneration(null);
                        setSerie(null);
                        setModification(null);
                    }}
                >
                    {models.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item> : null}
            {model != null ?
            <Form.Item
                label="Поколение"
                name="car_attributes.generation_id"
                rules={[{ required: true, message: 'Выберите поколение' }]}
            >
                <Select
                    placeholder="Выберите поколение"
                    value={generation}
                    onChange={(value) => {
                        setGeneration(value);
                        setSerie(null);
                        setModification(null);
                    }}
                >
                    {generations.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item> : null}
            {generation != null ?
            <Form.Item
                label="Серия"
                name="car_attributes.series_id"
                rules={[{ required: true, message: 'Выберите серию' }]}
            >
                <Select
                    placeholder="Выберите серию"
                    value={serie}
                    onChange={(value) => {
                        setSerie(value);
                        setModification(null);
                    }}
                >
                    {series.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item> : null}
            {serie != null ?
            <Form.Item
                label="Модификация"
                name="car_attributes.modification_id"
            >
                <Select
                    placeholder="Выберите модификацию"
                    value={modification}
                    onChange={(value) => {
                        setModification(value);
                    }}
                >
                    {modifications.data?.map((type) => (
                        <Select.Option value={type.id}>{type.name}</Select.Option>
                    ))}
                </Select>
            </Form.Item> : null}
            {type != null && model != null && mark != null ? <>
                <h5>Характеристики</h5>
                {characteristicsQuery.data?.map((characteristic) => (
                    <CharacteristicSelect
                        characteristic={characteristic}
                        modificationId={modification}
                    />
                ))}
            </> : null}
        </div>
    );
}

const CharacteristicSelect = ({ characteristic, modificationId }) => {
    const [values, setValues] = useState(null)

    const fetchValues = async () => {
        const response = await api.fetchCar('characteristics-values', {
            where: filterObject({
                car_characteristic_id: characteristic.id,
                car_modification_id: modificationId
            }),
            limit: 1000
        });

        setValues(response);
    }

    return (
        <>
            <div>
                <Form.Item
                    label={characteristic.name}
                    name={`car_attributes.characteristics.${characteristic.id}`}
                >
                    <Select
                        onClick={() => {
                            if (values == null) {
                                fetchValues();
                            }
                        }}
                    >
                        {values != null
                            ? values.map((value) => (
                                <Select.Option value={JSON.stringify({
                                    key: value.id,
                                    characteristic_id: characteristic.id,
                                    value: value.value
                                })}>
                                    {value.value}
                                </Select.Option>
                            ))
                            : <Select.Option value={null} disabled>
                                <div style={{textAlign: "center"}}>Загрузка...</div>
                            </Select.Option>
                        }
                    </Select>
                </Form.Item>
            </div>
        </>
    );
}