import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Input, TreeSelect } from 'antd';
import { useNavigate } from "react-router-dom";
import logo from "../../dist/img/logo.png";
import CategorySlider from "./category/category_slider";
import { SearchOutlined } from '@mui/icons-material';

import settings_sliders from '../../dist/icons/settings_sliders.svg'
import RoundedButton from './rounded_button';


const { Search } = Input;
const { TreeNode } = TreeSelect;

const SearchBar = ({ query }) => {
    const [value, setValue] = useState(undefined);
    const [search, setSearch] = useState(query ?? '');
    const history = useNavigate();

    const onChange = () => {
        setValue(value);
    }
    const SearchFilter = ()=>{
        
    }
    const handleSearch = () => {
        history(`/search-result?q=${search}`);
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        window.location.href = "/category/" + value;
    };

    return (
        <div>
            <div className="col-md-12">

                <div className="flex flex-row mt-4 mx-1 align-items-center justify-content-between">
                    <div className='flex-none d-md-none d-lg-block d-sm-none xs:hidden'>
                        <Link
                            className="navbar-brand d-flex align-items-center justify-content-center"
                            to="/">
                            <img src={logo} className='w-[200px]' />
                        </Link>
                    </div>

                    <div
                        className='flex-none border border-zinc-100 rounded-[14px] justify-center items-center inline-flex hover:bg-gray lg:ml-9 mr-3 md:ml-0'
                        style={{ width: '40px', height: '40px' }}
                    >

                        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-white'>
                            <g id="settings-sliders 1" clipPath="url(#clip0_448_103)">
                                <path id="Vector" d="M1.10417 4.80725H3.44117C3.6245 5.48181 4.02471 6.0773 4.58005 6.50185C5.13539 6.92641 5.815 7.15643 6.51403 7.15643C7.21306 7.15643 7.89267 6.92641 8.44801 6.50185C9.00335 6.0773 9.40356 5.48181 9.5869 4.80725H19.8958C20.1224 4.80725 20.3396 4.71725 20.4998 4.55707C20.66 4.39688 20.75 4.17962 20.75 3.95308C20.75 3.72654 20.66 3.50928 20.4998 3.34909C20.3396 3.1889 20.1224 3.09891 19.8958 3.09891H9.5869C9.40356 2.42435 9.00335 1.82886 8.44801 1.4043C7.89267 0.979753 7.21306 0.749733 6.51403 0.749733C5.815 0.749733 5.13539 0.979753 4.58005 1.4043C4.02471 1.82886 3.6245 2.42435 3.44117 3.09891H1.10417C0.877628 3.09891 0.660367 3.1889 0.50018 3.34909C0.339992 3.50928 0.25 3.72654 0.25 3.95308C0.25 4.17962 0.339992 4.39688 0.50018 4.55707C0.660367 4.71725 0.877628 4.80725 1.10417 4.80725ZM6.5136 2.45829C6.80925 2.45829 7.09825 2.54596 7.34407 2.71021C7.58988 2.87445 7.78147 3.10791 7.89461 3.38105C8.00775 3.65418 8.03735 3.95474 7.97967 4.2447C7.922 4.53466 7.77963 4.80101 7.57058 5.01006C7.36153 5.21911 7.09518 5.36147 6.80522 5.41915C6.51526 5.47683 6.21471 5.44722 5.94157 5.33409C5.66843 5.22095 5.43498 5.02936 5.27073 4.78354C5.10648 4.53772 5.01881 4.24872 5.01881 3.95308C5.01926 3.55677 5.1769 3.17683 5.45713 2.8966C5.73736 2.61637 6.1173 2.45874 6.5136 2.45829Z" fill="#222222" />
                                <path id="Vector_2" d="M19.8958 10.1458H17.5588C17.3758 9.47112 16.9758 8.87541 16.4205 8.45069C15.8652 8.02596 15.1855 7.79583 14.4864 7.79583C13.7873 7.79583 13.1076 8.02596 12.5523 8.45069C11.997 8.87541 11.597 9.47112 11.414 10.1458H1.10417C0.877628 10.1458 0.660367 10.2358 0.50018 10.396C0.339992 10.5562 0.25 10.7735 0.25 11C0.25 11.2265 0.339992 11.4438 0.50018 11.604C0.660367 11.7642 0.877628 11.8542 1.10417 11.8542H11.414C11.597 12.5289 11.997 13.1246 12.5523 13.5493C13.1076 13.9741 13.7873 14.2042 14.4864 14.2042C15.1855 14.2042 15.8652 13.9741 16.4205 13.5493C16.9758 13.1246 17.3758 12.5289 17.5588 11.8542H19.8958C20.1224 11.8542 20.3396 11.7642 20.4998 11.604C20.66 11.4438 20.75 11.2265 20.75 11C20.75 10.7735 20.66 10.5562 20.4998 10.396C20.3396 10.2358 20.1224 10.1458 19.8958 10.1458ZM14.4864 12.4948C14.1908 12.4948 13.9018 12.4071 13.6559 12.2429C13.4101 12.0786 13.2185 11.8452 13.1054 11.572C12.9923 11.2989 12.9626 10.9984 13.0203 10.7084C13.078 10.4184 13.2204 10.1521 13.4294 9.94303C13.6385 9.73398 13.9048 9.59162 14.1948 9.53394C14.4847 9.47626 14.7853 9.50586 15.0584 9.619C15.3316 9.73214 15.565 9.92373 15.7293 10.1695C15.8935 10.4154 15.9812 10.7044 15.9812 11C15.9807 11.3963 15.8231 11.7763 15.5429 12.0565C15.2626 12.3367 14.8827 12.4943 14.4864 12.4948Z" fill="#222222" />
                                <path id="Vector_3" d="M19.8958 17.1927H9.5869C9.40356 16.5181 9.00335 15.9227 8.44801 15.4981C7.89267 15.0735 7.21306 14.8435 6.51403 14.8435C5.815 14.8435 5.13539 15.0735 4.58005 15.4981C4.02471 15.9227 3.6245 16.5181 3.44117 17.1927H1.10417C0.877628 17.1927 0.660367 17.2827 0.50018 17.4429C0.339992 17.6031 0.25 17.8203 0.25 18.0469C0.25 18.2734 0.339992 18.4907 0.50018 18.6509C0.660367 18.8111 0.877628 18.901 1.10417 18.901H3.44117C3.6245 19.5756 4.02471 20.1711 4.58005 20.5956C5.13539 21.0202 5.815 21.2502 6.51403 21.2502C7.21306 21.2502 7.89267 21.0202 8.44801 20.5956C9.00335 20.1711 9.40356 19.5756 9.5869 18.901H19.8958C20.1224 18.901 20.3396 18.8111 20.4998 18.6509C20.66 18.4907 20.75 18.2734 20.75 18.0469C20.75 17.8203 20.66 17.6031 20.4998 17.4429C20.3396 17.2827 20.1224 17.1927 19.8958 17.1927ZM6.5136 19.5417C6.21796 19.5417 5.92896 19.454 5.68314 19.2897C5.43733 19.1255 5.24573 18.892 5.1326 18.6189C5.01946 18.3458 4.98986 18.0452 5.04753 17.7553C5.10521 17.4653 5.24758 17.1989 5.45663 16.9899C5.66568 16.7808 5.93202 16.6385 6.22198 16.5808C6.51195 16.5231 6.8125 16.5527 7.08564 16.6659C7.35877 16.779 7.59223 16.9706 7.75648 17.2164C7.92073 17.4622 8.0084 17.7512 8.0084 18.0469C8.00772 18.4431 7.85001 18.8229 7.56983 19.1031C7.28965 19.3833 6.90984 19.541 6.5136 19.5417Z" fill="#222222" />
                            </g>
                            <defs>
                                <clipPath id="clip0_448_103">
                                    <rect width="20.5" height="20.5" fill="white" transform="translate(0.25 0.75)" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>

                    <div className='flex-grow flex items-center justify-center'>
                        <input
                            type={"search"}
                            className='rounded-xl px-4 py-2 w-full border border-neutral-200 bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                            placeholder="Я ищу..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <SearchOutlined className='relative right-8  text-gray-400 ' />
                    </div>
                    <button
                        className='btn btn-primary rounded-xl px-[60px] py-[7px] ml-2 d-md-none d-lg-block d-sm-none d-xs-none'
                        type="primary"
                        onClick={handleSearch}>
                        Найти
                    </button>
                    <RoundedButton
                        className='d-md-block d-lg-none'
                        onClick={() => {
                            console.log('')
                        }}
                    >
                        <SearchOutlined />
                    </RoundedButton>
                </div>
                <div className="col-md-12 mt-3 pb-3 px-0">
                    <CategorySlider />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;