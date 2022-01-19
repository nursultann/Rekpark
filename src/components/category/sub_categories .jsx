import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Link,useHistory } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Cascader, Popover } from 'antd';
import {  setCategoryProducts } from "../../redux/actions/product_actions";
import { Form, Row, Col, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CustomAttributeField } from "../custom_components";

const SubCategories = ({category}) => {
    const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
      console.log('Received values of form: ', values);
    };
    console.log(category);
    
    return(
            <>
            {category?.children?.length ?
            <div className="col-md-12">
              {category.children.map((category)=>
                <a href="">{category.name}</a>
              )
              }    
            </div>
            :
            <div className="col-md-12 mt-3">
              <label className="mb-3" style={{fontSize:18}}>Поиск</label>
              <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
              >
              <div className="row">
              { category?.custom_attribute != null ?  
              category.custom_attribute.map((item)=> (
              <div className="col-md-4">  
              <Form.Item
                        key={item.name}
                        label={item.title}
                        name={item.name}
                        rules={[{required: item.is_required, message: item.placeholder}]}
              >
                        {CustomAttributeField(item)}
              </Form.Item>
              </div>
              ))
              :<>No attributes</>
              }
              </div>
              </Form>
            </div>
             } 
            </>
      );

};

export default SubCategories;