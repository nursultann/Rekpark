import React, { useEffect, useState } from "react";
import Ad from "./ad";
import Navbar from "../components/navbar";
import SearchBar from "../components/search-bar";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/actions/product_actions";
import { Link } from "react-router-dom";
import * as api from "../api";
import Footer from "../components/footer";
import { Skeleton, Grid } from "@mui/material";
import ProductItem from "../components/product/product_item";
import { Button, BackTop, Tooltip } from "antd";
import { UpOutlined } from "@ant-design/icons";
import banner from '../img/Полиграфия 90х160.jpg';
import banner2 from '../img/Сок 90х160.jpg';
import banner3 from '../img/Реклама 90х160.jpg';
import banner4 from '../img/Реклама 90х160 (2).jpg';
import News from "../components/news";

const Main = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [popular, setPopular] = useState([]);
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const limitP = 10;
  const [popularOffset, setPopularOffset] = useState(0);
  const fetchInitProducts = async () => {
    let _products = await api.fetchProducts({ 'with': 'user;region;city' });
    if (_products != null) {
      dispatch(setProducts(_products));
      // setOffset(offset + limit);
      console.table(_products);
    }
  };
  const fetchProducts = async () => {
    let prods = products.concat(await api.fetchProducts({ offset: offset, 'with': 'user;region;city' }));
    if (prods != null) {
      dispatch(setProducts(prods));
      setOffset(offset + limit);
    }
  };

  const fetchInitPopular = async () => {
    let _products = await api.fetchPopularProducts({ 'with': 'user;region;city', 'sort': 'popular' });
    if (_products != null) {
      setPopular(_products);
      // setOffset(offset + limit);
      console.table('popular', _products);
    }
  };
  const fetchPopular = async () => {
    let prods = products.concat(await api.fetchPopularProducts({ offset: popularOffset, 'with': 'user;region;city', 'sort': 'popular' }));
    if (prods != null) {
      setPopular(prods);
      setPopularOffset(popularOffset + limitP);
    }
  };
  useEffect(() => {
    document.title = "Главная страница";
    fetchInitProducts();
    fetchInitPopular();
  }, []);

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
      <Navbar />
      <SearchBar />
      <News />
      <main role="main" className="container-fluid mb-5">
        <div className="row">
          <div className="col-lg-9 px-3 px-lg-4">
            <h3 className="" style={{ fontSize: 16, color: "#424242" }}>Новые объявления:</h3>
            <div className="row mt-6 mb-6">
              {products === null || products === undefined || products.length === 0 ?
                <Grid container spacing={2} className="pl-4 pl-lg-3 pt-4 pb-4">
                  <Grid item lg={4} xs={11}>
                    <Skeleton variant="rectangular" width={'100%'} height={100} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                  <Grid item lg={4} xs={11}>
                    <Skeleton variant="rectangular" width={'100%'} height={100} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                  <Grid item lg={4} xs={11}>
                    <Skeleton variant="rectangular" width={'100%'} height={100} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Grid>
                </Grid>
                : products.map((product) => {
                  return (
                    <div className="col-6 col-sm-6 col-xl-3 mt-3" key={product.id}>
                      <div className="row px-2 px-xl-1">
                        <ProductItem product={product} />
                      </div>
                    </div>
                  )
                })}
            </div>
            <center className="mt-5">
              <Button
                type="primary"
                variant="outlined"
                onClick={() => {
                  fetchProducts();
                }}
                className="rounded-lg px-4"
              >
                Смотреть еще
              </Button>
            </center>
            <div className="col-12">
              <hr />
            </div>
            <h3 className="px-0 px-xl-2" style={{ fontSize: 16, color: "#424242" }}>Популярные объявления:</h3>
            <div className="row">
              {popular.length > 0 ?
                <>
                  {popular.map((i) =>
                    <div className="col-6 col-sm-6 col-xl-3 mt-3" key={i.id}>
                      <div className="row px-2 px-xl-1">
                        <ProductItem product={i} />
                      </div>
                    </div>
                  )
                  }

                </>
                :
                <>

                </>
              }
            </div>
            <center className="mt-5">
              <Button
                type="primary"
                variant="outlined"
                onClick={() => {
                  fetchPopular();
                }}
                className="rounded-lg px-4"
              >
                Смотреть еще
              </Button>
            </center>
          </div>
          <div className="col-lg-3 d-none d-lg-block">
            <img className="mt-4" src={banner} width={'100%'} alt="" />
            <img className="mt-2" src={banner2} width={'100%'} alt="" />
            <img className="mt-2" src={banner3} alt="" width={'100%'} />
            <img className="mt-2" src={banner4} alt="" width={'100%'} />
          </div>
          <BackTop>
            <Tooltip title="Наверх">
              <Button shape="circle" size="large" type="primary" icon={<UpOutlined />} />
            </Tooltip>
          </BackTop>
        </div>
      </main>
    </div>
  );
}
export default Main;