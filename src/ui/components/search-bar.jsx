import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Input, TreeSelect } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import * as api from "../../api";
import logo from "../../dist/img/logo.png";
import CategorySlider from "./category/category_slider";


const { Search } = Input;
const { TreeNode } = TreeSelect;

const SearchBar = () => {
    const [value, setValue] = useState(undefined);
    const [search, setSearch] = useState();
    const history = useHistory();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);

    const onChange = () => {
        setValue(value);
    }

    const Search = () => {
        history.push(`search_result/${search}`);
    }

    const [options, setOptions] = useState([]);

    const fetchCategoriesTree = async () => {
        const categories = await api.fetchCategoriesTree();
        if (categories != null) {
            dispatch(setCategories(categories));
            {
                categories.map((category) => {
                    category.children != null && category.children.length > 0 ?
                        <>
                            {setOptions(prevState => [...prevState, {
                                label: category.name,
                                value: category.id
                                // options: [
                                //   category.children.map((item)=>
                                //   {
                                //     label: item.name,
                                //     value: item.id,
                                //   },
                                //   )
                                // ],
                            }])
                            }
                        </>
                        :
                        <>
                        </>
                    console.log('options', categories);
                }
                )
            }
        }
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        window.location.href = "/category/" + value;
    };

    const contentMake = (cat) => {
        if (cat.children.length > 0) {
            return (
                <>
                    {cat.children.map((item) =>
                        <div className='bg-zinc-100 rounded-[8.87px] border border-neutral-200 justify-center items-center gap-[8.87px] inline-flex hover:bg-gray'>
                            <div className="w-[20.53px] h-[20.53px] relative">
                                <img src={item.image} width={35} alt="" />
                            </div>
                            <a href={"/category/" + item.id} className="ext-center text-neutral-800 text-xs font-medium font-['SF UI Display']">{item.name}</a>
                        </div>
                    )
                    }
                </>
            )
        }
    }

    useEffect(() => {
        fetchCategoriesTree();
    }, []);

    return (
        <div>
            <div className="col-md-12">

                <div className="flex flex-row mt-4 mx-1 align-items-center justify-content-between">
                    <div className='flex-none'>
                        <Link
                            className="navbar-brand d-flex align-items-center justify-content-center"
                            href="/">
                            <img src={logo} className='w-[200px]' />
                        </Link>
                    </div>

                    <div
                        className='flex-none bg-black rounded-[8.87px] justify-center items-center inline-flex hover:bg-gray text-white ml-9 mr-3'
                        style={{ width: '40px', height: '40px' }}
                    >
                        <i className="fa-solid fa-sliders"></i>
                    </div>

                    <input
                        type={"search"}
                        className=' form-control border-0 bg-light mr-3 rounded-lg'
                        placeholder="Я ищу..."
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />

                    <button
                        className='btn btn-primary rounded-xl px-[60px] py-2'
                        type="primary"
                        onClick={Search}>
                        Найти
                    </button>
                </div>

                <div className="col-md-12 mt-3 pb-4 px-0">
                    <CategorySlider />
                </div>

            </div>

            <hr />
        </div>
    );
}

export default SearchBar;