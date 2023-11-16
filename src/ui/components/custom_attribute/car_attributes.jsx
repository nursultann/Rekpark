import React, { useState } from "react";
import { useQuery } from "react-query";
import * as api from "../../../api";
import { SearchableSelect } from "../default_input_fields";
import { useEffectOnce } from "react-use";

const filterObject = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== null && obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });

    return newObj;
}

export default function CarAttributes({
    type,
    mark,
    model,
    generation,
    series,
    modification,
    characteristics,
    onChange,
}) {

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
    const seriesQuery = useQuery(['series', type, mark, model, generation], () => api.fetchCar('series', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_generation_id: generation
        }),
        limit: 1000
    }));
    const modifications = useQuery(['modifications', type, mark, model, generation, series], () => api.fetchCar('modifications', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_series_id: series
        }),
        limit: 1000
    }));
    const characteristicsQuery = useQuery(['characteristics', type, mark, model], () => api.fetchCar('characteristics', {
        where: filterObject({
            car_type_id: type,
            car_model_id: model,
            car_mark_id: mark,
        }),
        where_allow_null: true,
        limit: 1000,
        with_values: true
    }));

    console.log('marks', marks)

    return (
        <div>
            <SearchableSelect
                value={type}
                placeholder="Выберите тип"
                onChange={(value) => {
                    onChange({
                        type: value,
                        mark: null,
                        model: null,
                        generation: null,
                        series: null,
                        modification: null,
                    });
                }}
                options={types.data?.map((type) => ({ value: type.id, label: type.name }))}
            />

            {type != null ?
                <SearchableSelect
                    placeholder="Выберите марку"
                    value={mark}
                    onChange={(value) => {
                        onChange({
                            type: type,
                            mark: value,
                            model: null,
                            generation: null,
                            series: null,
                            modification: null,
                        });
                    }}
                    className="mt-[15px]"
                    options={marks.data?.map((type) => ({ value: type.id, label: type.name }))}
                />
                : null}
            {mark != null ?
                <SearchableSelect
                    placeholder="Выберите модель"
                    value={model}
                    onChange={(value) => {
                        onChange({
                            type: type,
                            mark: mark,
                            model: value,
                            generation: null,
                            series: null,
                            modification: null,
                        });
                    }}
                    className="mt-[15px]"
                    options={models.data?.map((type) => ({ value: type.id, label: type.name }))}
                />
                : null}
            {model != null ?
                <SearchableSelect
                    placeholder="Выберите поколение"
                    value={generation}
                    onChange={(value) => {
                        onChange({
                            type: type,
                            mark: mark,
                            model: model,
                            generation: value,
                            series: null,
                            modification: null,
                        });
                    }}
                    className="mt-[15px]"
                    options={generations.data?.map((type) => ({ value: type.id, label: type.name }))}
                />
                : null}
            {generation != null ?
                <SearchableSelect
                    placeholder="Выберите серию"
                    value={series}
                    onChange={(value) => {
                        onChange({
                            type: type,
                            mark: mark,
                            model: model,
                            generation: generation,
                            series: value,
                            modification: null,
                        });
                    }}
                    className="mt-[15px]"
                    options={seriesQuery.data?.map((type) => ({ value: type.id, label: type.name }))}
                />
                : null}
            {series != null ?
                <SearchableSelect
                    placeholder="Выберите модификацию"
                    value={modification}
                    onChange={(value) => {
                        onChange({
                            type: type,
                            mark: mark,
                            model: model,
                            generation: generation,
                            series: series,
                            modification: value,
                        });
                    }}
                    className="mt-[15px]"
                    options={modifications.data?.map((type) => ({ value: type.id, label: type.name }))}
                />
                : null}
            {type != null && model != null && mark != null ? <>
                <h5
                    className="text-[15px] font-bold mt-[25px] mb-[14px] cursor-pointer"
                >Характеристики</h5>
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

    useEffectOnce(() => {
        fetchValues();
    });

    return (
        <>
            <div>
                <SearchableSelect
                    placeholder={characteristic.name}
                    options={values?.map((value) => ({ value: value.id, label: value.value }))}
                />
            </div>
        </>
    );
}