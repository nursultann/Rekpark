import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../api";
import { setProductDetails } from "../redux/actions/product_actions";
import Carousel from 'react-gallery-carousel';
import { FacebookShareButton, WhatsappShareButton,TelegramShareButton } from "react-share";
import { FacebookIcon,WhatsappIcon, TelegramIcon } from "react-share";
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';
const { TextArea } = Input;
const Ad = ({match}) => {
    const dispatch = useDispatch();
    const {productDetails} = useSelector((state) => state.product);
    // const {shareUrl,setUrl} = useState();
    // setUrl();
    const fetchProductDetails = async () => {
        const productDetails = await fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute;region;city'
        });
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
        }
    };
    const token = localStorage.getItem('token');
    const [submitting,setSubmitting]=useState(false);
    const [value,setValue]=useState('');
    const onSubmit = ()=>{
        if (!value) {
            return;
        }
        setSubmitting(true);

        setTimeout(() => {
            alert("added"+value);
            setSubmitting(false);
            setValue('');
          }, 1000);
    }
    const CommentList = (productDetails) => (
        <List
          dataSource={productDetails.comments}
          header={`${productDetails.comments.length} ${productDetails.comments.length > 1 ? 'Комментариев' : 'Комментариев'}`}
          itemLayout="horizontal"
          renderItem={props => <Comment {...props} />}
        />
      );

    useEffect(() => {
        fetchProductDetails();
    }, []);
    if(productDetails!=null){
    var nowMonth = new Date().getMonth();
    var nowYear = new Date().getFullYear();
    var nowDate = new Date().getDate();
    var nowDay = new Date().getDay();
    var Update = new Date(productDetails.updated_at);
    var updated_day = Update.getDay();
    var updated_date = Update.getDate();
    var updated_month = Update.getMonth();
    var updated_year = Update.getFullYear();
    var update = updated_date + '/' + updated_month + '/' + updated_year;
    if(updated_day == nowDay && updated_date == nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Сегодня";
    } else if (updated_day < nowDay && updated_day + 1 == nowDay || updated_day == nowDay + 6 && updated_date < nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Вчера";
    } else if (updated_day < nowDay && updated_day + 2 == nowDay || updated_day == nowDay + 5 && updated_date < nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Позавчера";
    }
}          
    return(
        <div>
            <Navbar />  
                {productDetails != null ? <>          
                <div className="col-md-12 mt-2">
                        <div className="row">
                            <div className="col-md-2">
                            <img src="https://www.bazar.kg/build/images/no-avatar.451f5561.svg" style={{borderRadius:"50%",width:"50px", height:"50px"}}/>
                            <label className="ml-2">{productDetails.name}</label>
                            <hr className="d-block d-md-none" />
                            </div>
                            <div className="col-6 col-md-3 mt-2"> 
                            <label className="text-muted">Поделиться</label><br/>    
                            <FacebookShareButton
                                url={window.location.href}
                                quote={"フェイスブックはタイトルが付けれるようです"}
                                hashtag={"#hashtag"}
                                description={"aiueo"}
                                className="Demo__some-network__share-button mr-1"
                            >
                            <FacebookIcon size={30} round />
                            </FacebookShareButton>
                            <WhatsappShareButton 
                            url={window.location.href}
                            quote={"フェイスブックはタイトルが付けれるようです"}
                            hashtag={"#hashtag"}
                            description={"aiueo"}
                            className="Demo__some-network__share-button mr-1"
                            >
                                <WhatsappIcon size={30} round />
                            </WhatsappShareButton>
                            <TelegramShareButton 
                            url={window.location.href}
                            quote={"フェイスブックはタイトルが付けれるようです"}
                            hashtag={"#hashtag"}
                            description={"aiueo"}
                            className="Demo__some-network__share-button"
                            >
                                <TelegramIcon size={30} round />
                            </TelegramShareButton>
                            </div>
                            <div className="col-6 col-md-3 mt-0 mt-md-2">
                            <label class="ml-3 text-muted"><i class="far fa-eye"></i> {productDetails.views}<br/>
                            <i class="fas fa-map-marker-alt"></i> {productDetails.region != null ? productDetails.region.name+","+productDetails.city.name : ""}<br/>
                            <i class="far fa-clock"></i> {update}
                            </label>
                            </div>
                            <div className="col-md-3 mt-2">
                            <hr className="d-block d-md-none" /> 
                            <Button class="btn btn-outline-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Показать номер</Button>
                                <div class="collapse multi-collapse" id="multiCollapseExample1">
                                    <div class="card card-body">
                                    <a href={"tel:"+productDetails.phones}>{productDetails.phones}</a>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    <hr/>
                </div>
                
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-8">
                                    <Carousel 
                                        images={productDetails.media.map((item) => ({
                                            src: `${item.original_url}`
                                        }))} 
                                        style={{ height:"350px", width: "100%" }} />
                                </div>
                                <div className="col-md-4">
                                <hr className="d-block d-md-none" />
                                    <div className="row">
                                        <div className="col-md-8" style={{fontSize:"14px",whiteSpace:"normal"}}>
                                            <label style={{fontSize:"18px",whiteSpace:"normal"}} className="text-secondary">{productDetails.title}</label><br/>
                                            <label>Цена:{productDetails.price+" " + productDetails.currency_symbol}</label><br/>
                                            {productDetails.custom_attribute_values != null ? 
                                                productDetails.custom_attribute_values.map((item) => {
                                                    return (
                                                        <>
                                                        <label>{item.custom_attribute.title}: {item.value}</label><br/>
                                                        </>
                                                        )
                                                })
                                                : <></>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="col-md-12">
                            <label style={{fontSize:"18px",whiteSpace:"normal"}}>Описание</label>
                            <p>{productDetails.description}</p>
                            </div>
                            <hr/>
                            <div className="col-md-12">
                            {
                                token != null ? 
                                    <>
                                    {    
                                    productDetails.can_comment == "all" ?
                                    <div className="col-md-12">
                                    {
                                    productDetails.comments != null && productDetails.comments.length >0 ? <CommentList comments={productDetails.comments} />
                                    : <>Нет комментариев</>
                                    }    
                                        <Comment
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                        content={
                                            <>
                                            <Form.Item>
                                            <TextArea rows={4} 
                                            onChange={(e) => { setValue(e.target.value)}} value={value} />
                                            </Form.Item>
                                            <Form.Item>
                                            <Button htmlType="submit" loading={submitting} onClick={onSubmit} style={{backgroundColor:"#000fa6",color:"#fff"}}>
                                                Добавить комментарий
                                            </Button>
                                            </Form.Item>
                                        </>
                                        }
                                        />
                                        
                                    </div>
                                    : 
                                    <></>
                                    }</>
                                    : 
                                    <>
                                    <div className="col-md-12 py-2">
                                    <label style={{fontSize:14}}>Чтобы оставить комментарий нужно авторизоваться</label>
                                    <br/>
                                    <Button style={{borderColor:"#000fa6",color:"#000fa6"}}><a href="/login">Войти</a></Button>
                                    </div>
                                    </>
                            }
                            </div>
                        </div>
                        <div className="col-md-3">

                        </div>
                    </div>
                </div>
                </> : <div>loading</div>}
                <Footer/>  
        </div>
    );
}

export default Ad;