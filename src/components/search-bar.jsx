import {useState,useEffect,Link} from 'react';
import img from '../img/logo.png';
import React from "react";
import CategorySlider from "./category/category_slider";
import {Button} from 'antd';
import { Cascader } from 'antd';
import { Input, Space } from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
import { setCategories } from "../redux/actions/category_actions";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { TreeSelect } from 'antd';
import {useHistory} from "react-router-dom";
const { Search } = Input;
const { TreeNode } = TreeSelect;
const SearchBar = () => {
  const [value, setValue] = useState(undefined);
  const [search,setSearch] = useState();
  const history = useHistory();
  const onChange = () => {
    setValue(value);
  }
  const Search = ()=>{
    history.push(`search_result/${search}`);
  }
  const dispatch = useDispatch();
    const {categories} = useSelector((state) => state.category);

    const fetchCategoriesTree = async () => {
        const categories = await api.fetchCategoriesTree();
        if (categories != null) {
            dispatch(setCategories(categories));
        }
    };
    useEffect(() => {
      fetchCategoriesTree();
  }, []);
  const childrenContent = (children) => (
    <>
        {children.map((item) => (<>
          <TreeNode 
          id={item.id}
          value={item.name}
          title={item.name}
          >                     
        </TreeNode>
        </>))}
        
    </>
);
// const content = (category) => {
//   return (
//     <>
//     <Link to={`/category/${category.id}`}></Link>
//     </>
//   );
// };
        return(
            <div>
            <div class="col-md-12">
    <div class="row mt-4">
        <div class="col-md-12 px-5">
        <div className='row d-flex align-items-center'>
          <div className='col-md-4 px-0 px-md-1 py-1 py-md-'>  
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Категории"
                allowClear
                treeDefaultExpandAll
                onChange={onChange}
              >
                {categories.map((category) => {
                      return (
                        category.children?.length ? 
                        <TreeNode  
                            placement="bottom"
                            id={category.id} 
                            value={category.name} 
                            title={category.name}
                        >
                            {childrenContent(category.children)}
                        </TreeNode> 
                        : <TreeNode 
                        id={category.id} 
                        value={category.name} 
                        title={category.name}>
                        </TreeNode>
                        )  
                    })}
              </TreeSelect>
          </div>
          <div className="col-md-8 px-0 px-md-1 mt-2 mt-md-0 py-1 py-md-0">
              <Input className='col-md-10' placeholder="Поиск..." onChange={(e)=>{setSearch(e.target.value)}} style={{ width: "100%" }} />
              <Button className='ml-0 ml-md-2 mt-3 mt-md-0 col-xs-12 col-md-1 rounded-pill' type="primary" style={{backgroundColor:'#000fa6'}} onClick={Search}>
              <SearchOutlined />
              </Button>
          </div>    
        </div>
        </div>
    </div>
    <div className="col-md-12 py-3">
      <hr/>
      <center><CategorySlider /></center>
    </div>
    
  </div>
  <hr/>
  </div>
        );
    }
export default SearchBar;