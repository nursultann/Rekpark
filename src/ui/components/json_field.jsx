import React, { useState } from "react";


const JsonField = ({ fields, values, onChange, className }) => {
    const [newValues, setNewValues] = useState([]);

    return (
        <div className={className}>
            <div className="flex flex-col gap-2">
                {values.map((item, index) => (
                    <div key={index} className="flex flex-row gap-2 items-center">
                        <input
                            type="text"
                            className="border rounded-[10px] px-[20px] py-[10px] w-full"
                            value={item.value}
                            onChange={(e) => {
                                const newValues = [...values];
                                newValues[index] = e.target.value;
                                onChange(newValues);
                            }}
                        />
                        <button
                            className="w-[40px] h-[40px] rounded-[10px] bg-primary text-white flex items-center justify-center"
                            onClick={(e) => {
                                e.preventDefault();
                                const newValues = [...values];
                                newValues.splice(index, 1);
                                onChange(newValues);
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))}

                <div className="flex flex-row gap-2 items-center">
                    {fields.map((item, index) => (
                        <input
                            key={index}
                            type="text"
                            className="border rounded-[10px] px-[20px] py-[10px] w-full"
                            placeholder={item.title}
                            value={newValues[index]?.value || ""}
                            onChange={(e) => {
                                const values = [...newValues];
                                values[index] = { key: item.key, value: e.target.value };
                                setNewValues(values);
                            }}
                        />
                    ))}
                    <button
                        className="w-[40px] h-[40px] rounded-[10px] bg-primary text-white flex items-center justify-center"
                        onClick={(e) => {
                            e.preventDefault();
                            if (newValues.length === fields.length) {
                                const newValues2 = [...values];
                                newValues2.push(...newValues);
                                onChange(newValues2);
                                setNewValues([]);
                            }
                        }}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>

            </div>
        </div>
    );

}

export default JsonField;
