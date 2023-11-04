import {Form} from "antd";
import {CustomAttributeField} from "../custom_components";
import React from "react";

function CategoryAttributes({ category }) {
    if (category?.custom_attribute == null) {
        return null
    }

    const customAttributes = category.custom_attribute;

    return (
        <>
            {customAttributes.map((item) => (
                <Form.Item
                    key={item.name}
                    label={item.title}
                    name={item.name}
                    onChange = {(item) => {
                    }}
                    rules={[{ required: item.is_required, message: item.placeholder }]}
                >
                    {CustomAttributeField(item)}
                </Form.Item>
            ))}
        </>
    )
}