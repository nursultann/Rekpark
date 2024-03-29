import React, { useState } from "react";
import {
  Image,
  Input,
  InputNumber,
  Select,
  Switch
} from "antd";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { DefaultInput, DefaultSelect, SearchableSelect } from "./default_input_fields";
import { useEffectOnce } from "react-use";
import { load } from "@2gis/mapgl";
import { fetchCustomAttributeRelations } from "../../api";

const { Option } = Select;

const NewCustomAttributeField = ({ item, value, onChange }) => {
  let values = item.values;
  if (typeof item.values === 'string') {
    values = JSON.parse(item.values);
  }

  if (['TEXT', 'STRING', 'INT', 'BOOLEAN'].includes(item.type)) {
    let type = item.type.toLowerCase();
    if (type === 'string') {
      type = 'text';
    }

    return (
      <DefaultInput
        placeholder={item.placeholder}
        type={type}
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    );
  }

  if (['SELECT', 'MULTISELECT', 'ARRAY'].includes(item.type)) {

    return (
      <DefaultSelect
        placeholder={item.placeholder}
        multiple={item.type === 'MULTISELECT' || item.type === 'ARRAY'}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value}
      >
        {Object.keys(values['options']).map((itm, index) => {
          return (<option key={index} value={itm}>{itm}</option>);
        })}
      </DefaultSelect>
    );
  }

  if (item.type === 'RELATION') {
    return (
      <RelationField
        item={item}
        value={value}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
    );
  }

  return (<input placeholder="Unknown type" />)
}

const RelationField = ({ item, value, onChange }) => {
  const [values, setValues] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffectOnce(() => {
    if (typeof item.values === 'string') {
      const values = JSON.parse(item.values);
      setValues(values);
    }
    loadOptions();
  });

  const loadOptions = async () => {
    setLoading(true);
    const options = await fetchCustomAttributeRelations(item.id);
    setOptions(options);
    setLoading(false);
  }

  const key = values['label'];

  return (
    <SearchableSelect
      name={item.name}
      placeholder={item.placeholder}
      onChange={onChange}
      value={value}
      options={options.map((itm, ind) => {
        return ({ value: itm['id'], label: itm[key] });
      })}
    />
  );
}

const CustomAttributeField = (item) => {
  const values = JSON.parse(item.values);
  switch (item.type) {
    case 'TEXT':
      return (
        <Input.TextArea
          id={item.name}
          rows={4}
          placeholder={item.title}
          className="w-100 mb-2"
        />
      );
    case 'INT':
      return (<InputNumber id={item.name} placeholder={item.placeholder} initialValues={0} className="w-100 mb-2" />);
    case 'SELECT':
      return (
        <Select
          placeholder={item.title}
          id={item.name}
          labelId={`${item.name}_label`}
          className="w-100 mb-2"
        >
          {Object.keys(values).map((itm) => {
            return (<Option value={values[itm]}>{values[itm]}</Option>);
          })}
        </Select>
      );
    case 'BOOLEAN':
      return (
        <Switch
          id={item.name}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          className="w-100 mb-2"
        />
      );
    case 'RELATION':

      return (
        <Select placeholder={item.title} id={item.name} labelId={`${item.name}_label`} className="w-100 mb-2">
          {Object.keys(values).map((itm) => {
            return (<Option value={values[itm]}>{values[itm]}</Option>);
          })}
        </Select>
      );
      // case 'RELATION':
      //   return (
      //     <Select placeholder={item.title} id={item.name} labelId={`${item.name}_label`} className="w-100 mb-2">
      //       {Object.keys(values).map((itm) => {
      //         return (<Option value={values[itm]}>{values[itm]}</Option>);
      //       })}
      //     </Select>
      //   );
    case 'ARRAY':
      return (<></>);
    default:
      return (<Input id={item.name} label={item.placeholder} className="w-100 mb-2" />);
  }
};

const AppImage = ({ src, height, width, style, placeholder, className }) => {
  return (
    <Image
      src={src}
      height={height}
      width={width}
      style={style}
      placeholder={placeholder}
      className={'rounded-lg'}
      preview={false}
      fallback="data:image/png;base64,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"
    />
  );
};

export { CustomAttributeField, AppImage, NewCustomAttributeField };