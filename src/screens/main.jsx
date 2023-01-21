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
import ProductGridList from "../components/product/product_grid_list";
import Bussiness_Slider from "../components/bussiness/bussiness_slider";
import News from "../components/news";

const Main = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const limit = 20;
  const [offset, setOffset] = useState(0);

  const fetchInitProducts = async () => {
    let _products = await api.fetchProducts({ 'sort': true, 'with': 'user' });
    if (_products != null) {
      _products = _products.concat(await api.fetchProducts({ 'with': 'user' }));
      dispatch(setProducts(_products));
      // setOffset(offset + limit);
      console.table(_products);
    }
  };
  const fetchProducts = async () => {
    let prods = products.concat(await api.fetchProducts({ offset: offset }));
    if (prods != null) {
      dispatch(setProducts(prods));
      setOffset(offset + limit);
    }
  };

  useEffect(() => {
    document.title = "Главная страница";
    fetchInitProducts();
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
          <div className="col-lg-12">
            <h3 className="px-2 py-1" style={{ fontSize: 19, color : "#424242"  }}>Новые объявления в Кыргызстане</h3>
            <hr/>
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
                    <div className="col-6 col-sm-6 col-xl-3 mt-3">
                      <div className="row px-1">
                      <ProductItem product={product} />
                      </div>
                    </div>
                  )
                })}
            </div>
            <center className="mt-5">
              <Button
                variant="outlined"
                onClick={() => {
                  fetchProducts();
                }}
                style={{ backgroundColor: "#184d9f", color: "#fff" }}
                className = "rounded-pill"
                >
                Показать еще
              </Button>
            </center>
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