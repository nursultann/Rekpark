import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import SearchBar from "../../components/search-bar";
import * as api from "../../../api";
import ProductItem, { ProductItemSkeleton } from "../../components/product/product_item";
import { Button, BackTop, Tooltip } from "antd";
import { UpOutlined } from "@ant-design/icons";
import NewsGrid from "../../components/news";
import { useEffectOnce } from "react-use";
import RightBannerPicture from '../../../dist/img/Полиграфия 90х160.jpg';
import RightBannerPicture2 from '../../../dist/img/Реклама 90х160 (2).jpg';
import RightBannerPicture3 from '../../../dist/img/Реклама 90х160.jpg';
const HomePage = () => {
  useEffectOnce(() => {
    document.title = "Главная страница";
  });

  const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  };

  return (
    <div>
      <SearchBar />
      <main role="main" className="container-fluid mb-5">
        <div className="row">
          <div className="col-lg-9 col-md-12 pr-0">
            <div className="flex flex-grow gap-4 h-[400px] overflow-x-scroll d-none d-md-none w-full">
              {Array.from(new Array(10)).map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`d-inline-block w-[200px] h-[400px] rounded-[10px] bg-gray-200 xl:h-[400px] lg:h-[300px] md:w-[200px]`}
                    style={{ objectFit: 'cover', backgroundImage: `url(${RightBannerPicture})` }}
                  />
                )
              })}
            </div>
            <NewsGrid />
            <ProductsGrid
              title="Новые объявления:"
            />
            <ProductsGrid
              title="Популярные:"
              className={'mt-5'}
            />
          </div>

          <div className="col-lg-3 mt-5 d-md-none d-lg-block">
            <div className="flex lg:flex-col justify-start items-start gap-4 lg:h-[100%] md:flex-row md:gap-2 md:overflow-scroll md:h-[400px] overflow-hidden">
              {/* {Array.from(new Array(1)).map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`lg:w-full h-[400px] rounded-[10px] bg-gray-200 xl:h-[400px] lg:h-[300px] md:w-[200px]`}
                    style={{ objectFit: 'cover', backgroundImage: `url(${LeftBannerPicture})` }}
                  />
                  
                )
              })} */}
              <img src={RightBannerPicture} alt="" width={'100%'} />
              <img src={RightBannerPicture2} alt="" width={'100%'} />
              <img src={RightBannerPicture3} alt="" width={'100%'} />
            </div>
          </div>

          <BackTop>
            <Tooltip title="Наверх">
              <div
                className="w-[40px] h-[40px] rounded-[50%] bg-blue-500 flex justify-center items-center cursor-pointer text-white"
              >
                <UpOutlined />
              </div>
            </Tooltip>
          </BackTop>
        </div >
      </main >
    </div >
  );
}
function ProductsGrid({
  title,
  to = "/products",
  className,
}) {
  const [products, setProducts] = useState([]);
  const limit = 6;
  const [offset, setOffset] = useState(0);
  const fetchProducts = async () => {
    let prods = await api.fetchProducts({
      offset: offset,
      limit: limit,
      'with': 'user;region;city'
    });
    if (prods != null) {
      setProducts(prods);
      setOffset(offset + limit);
    }
  };

  useEffectOnce(() => {
    fetchProducts();
  })

  const isLoading = products === null || products === undefined || products.length === 0;

  return (
    <div className={className}>
      <h3 className="px-0 " style={{ fontSize: 16, color: "#424242" }}>{title}</h3>
      <div className="grid grid-cols-3 gap-4 mt-[25px] xxl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1">
        {
          isLoading ? (Array.from(new Array(4))).map((item, index) => {
            return (
              <ProductItemSkeleton
                key={index}
              />
            )
          }) :
            products?.map((item, index) => {
              return (
                <ProductItem
                  key={index}
                  product={item}
                  onClick={() => { }}
                />
              )
            })
        }
      </div>
      {products?.length > 0 && (
        <div className="flex justify-center items-center mt-5">
          <Link
            to={to}
            className="text-[15px] font-medium font-['SF UI Display'] btn btn-primary rounded-xl px-5  text-white"
          >
            Смотреть все
          </Link>
        </div>
        
      )}
    </div>
  )
}

export default HomePage;