import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, userDetails} from "../api";
import { addToFavorites, answerComment, deleteComments, getComplaints, postComment, postComplaints, removeFromFavorites} from "../api/product";
import { setProductDetails } from "../redux/actions/product_actions";
import Carousel from 'react-gallery-carousel';
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, TelegramIcon } from "react-share";
import { Modal,Comment, Avatar, Form, Button, List, Input, Tooltip,message,Select } from 'antd';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import { createComment } from "../api/product";
import { setProductUserDetails } from "../redux/actions/user_actions";
const key = "updateable";
const { TextArea } = Input;
const { Option } = Select;

const Ad = ({ match }) => {
    const dispatch = useDispatch();
    const { productDetails } = useSelector((state) => state.product);
    const [favorite,setFavorite] = useState();
    const [userId,setUserId] = useState();
    const [parentId,setParentId] = useState();
    const [comment,setComment] = useState(false);
    const [userDetail,setUserDetail] = useState();
    const [complaintsText,setComplaintsText] = useState();
    const [reason,setReason] = useState();
    const [childrens,setChildrens] = useState();
    const [productUserDetails,setProductUserDetail] = useState();
    const fetchProductDetails = async () => {
        const productDetails = await fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute;region;city;user;comments.user'
        });
         if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
            setFavorite(productDetails.is_favorite);
            dispatch(setProductUserDetails(productDetails.user));
            document.title = productDetails.title;
        }
        const user = await userDetails();
         if(user != null){
            setUserDetail(user);
            setUserId(user.id);   
        }
    };
    //reason
    const fetchComplaints = async () =>{
    const complaints = await getComplaints();
    if(complaints != null){
    setChildrens(complaints);
    }
    // const childrens = [];
    // for (let i = 10; i < 36; i++) {
    //   childrens.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    // }
}
//comments
    const token = localStorage.getItem('token');
    const [submitting,setSubmitting]=useState(false);
    const [value,setValue]=useState('');
    const onSubmit = async ()=>{
        if (!value) {
            return;
        }
        const user = await userDetails();
         if(user != null){
            setUserId(user.id);   
        }
        setSubmitting(true);
        const result = await createComment(value, productDetails.id, userId);
        if (result) {
            setValue('');
            message.success({ content: 'Добавлен комментарий!', key, duration: 2 });
            fetchProductDetails();
        }
        setSubmitting(false);
    }
    const clickAnswer=(userName,parent)=>{
        setComment(true);
        setParentId(parent);
        setValue("@"+userName);
    }
    const deleteComment= async (id) => {
        const result = await deleteComments(id);
        if (result) {
            message.error({ content: 'Комментарий удалён!', key, duration: 2 });
            fetchProductDetails();
        }
    }
    const Answer = async ()=>{
        const user = await userDetails();
         if(user != null){
            setUserId(user.id);            
        }
        setSubmitting(true);
        const result = await answerComment(value, productDetails.id,userId,parentId);
        if (result) {
            setValue('');
            message.success({ content: 'Добавлен ответ на комментарий!', key, duration: 2 });
            fetchProductDetails();
        }
        setSubmitting(false);
    }
    const CommentList = (productDetails) => (
        <List
            dataSource={productDetails.comments}
            header={`${productDetails.comments.length} ${productDetails.comments.length > 1 ? 'Комментариев' : 'Комментариев'}`}
            itemLayout="horizontal"
            renderItem={item => <Comment
                actions={[
                    <span key="comment-basic-reply-to" onClick={() => clickAnswer(item.user.name,item.id)}>{token != null ? <>Ответить</> : <></>}</span>,
                    <span key="comment-basic-reply-to" onClick={() => deleteComment(item.id)}>{item.user.id == userId ? <>Удалить</> : <></>}</span>
                ]}
                avatar={<Avatar src={item.user.media?.length ? item.user.media[0].original_url : 'https://joeschmoe.io/api/v1/random'} />}
                author={item.user.name}
                content={item.text}
            />}
        />
        // <div className="col-xl-12">
        // <div className="row">
        //     <div className="col-xl-12 px-0"><b>{productDetails.comments.length+" Комментариев"}</b></div>
        // <hr/>
        // {productDetails.comments.length > 0 ? 
        // <div>
        //    {productDetails.comments.map((item)=>
        //    <div className="col-xl-12">
        //    <div className="row">
        //        <div className="col-3 px-0 col-xl-1">
        //             <img className="rounded-circle" src={item.user.media?.length ? item.user.media[0].original_url : 'https://joeschmoe.io/api/v1/random'} 
        //             width="100%" />            
        //        </div>
        //        <div className="col-9 px-2 col-xl-11">
        //        <label className="text-muted">{item.user.name}</label><br/>
        //            {item.text}
        //         <br/>
        //         <span key="comment-basic-reply-to" onClick={clickAnswer(item.user.name,item.id)}>Ответить</span>
        //         <span key="comment-basic-reply-to" onClick={deleteComment(item.id)}>Удалить</span>
        //        </div>   
        //     <hr className="col-12"/>   
        //    </div>
        //    </div>
        //    )}   
        // </div>
        // :
        // <>
        //     Нет Комментариев
        // </>
        // }
        // </div>
        // </div>
    );

    const addFav = async () =>{
        const addToFav = await addToFavorites(productDetails.id);
        message.success({ content: 'Добавлено в избранное!', key, duration: 2 });
        setFavorite(true);
    }
    const removeFav = async ()=>{
        const addToFav = await removeFromFavorites(productDetails.id);
        message.error({ content: 'Удалено из избранного!', key, duration: 2 });
        setFavorite(false);
    }
    useEffect(() => {
        fetchProductDetails();
        fetchComplaints();

    }, []);
  //complaints
  const PostComplaint = async () =>{
    const params = {
        'complaint_type_id':reason,
        'text':complaintsText,
        'advertisement_id':productDetails.id
    }
    const postComplaint = await postComplaints(params);
    message.success("Ваше обращение отправлено!",1000);
  }
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState('Content of the modal');

  const showModal = () => {
    setVisible(true);
  };
  function handleChange(value) {
    console.log(`Selected: ${value}`);
    setReason(value);
  }
  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

    if (productDetails != null) {
        var time = moment(productDetails.created_at, 'YYYYMMDD, h:mm:ss a');
        moment.locale('ru');
        var update = time.calendar();
    }
    return (
        <div>
            <Navbar />  
                {productDetails != null ? <>          
                <div className="col-xl-12 mt-xl-3 mt-3">
                    <div className="row px-xl-3 px-2">
                        <div className="col-xl-8 border rounded py-3">
                            <div className="row">
                                <div className="col-xl-12">
                                    <label style={{ fontSize: "22px", whiteSpace: "normal" }}>{productDetails.title}</label><br />
                                    <Carousel
                                        images={productDetails.media.map((item) => ({
                                            src: `${item.original_url}`
                                        }))}
                                        style={{ height: "450px", width: "100%" }}
                                    />
                                </div>
                                <div className="col-xl-12">
                                    <hr className="d-block d-xl-none" />
                                    <div className="row">
                                        <div className="col-xl-12 mt-3" style={{ fontSize: "14px", whiteSpace: "normal" }}>
                                            <div className="row">
                                                <label className="col-6"><b>Категория:</b></label><label className="col-6 label">{productDetails.category != null ? productDetails.category.name : <></>}</label>
                                                <label className="col-6"><b>Цена:</b></label><label className="col-6 label">{productDetails.price + " " + productDetails.currency_symbol}</label>
                                                {productDetails.custom_attribute_values != null ?
                                                    productDetails.custom_attribute_values.map((item) => {
                                                        return (
                                                            <>
                                                                <label className="col-6"><b>{item.custom_attribute.title}:</b></label>
                                                                <label className="col-6">{item.value}</label>
                                                            </>
                                                        )
                                                    })
                                                    : <></>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="col-xl-12">
                                <label style={{ fontSize: "18px", whiteSpace: "normal" }}><b>Описание</b></label>
                                <p className="label">{productDetails.description}</p>
                            </div>
                        </div>
                        <div className="col-xl-4">
                        <div className="col-xl-12 border rounded mt-3 mt-xl-0">
                                    <div className="row">
                                        <div className="col-xl-12 mt-xl-4">
                                        <hr className="d-block d-xl-none" /> 
                                        <button class="btn col-xl-12 text-white" style={{backgroundColor:"#4dab04"}} data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i class="fas fa-phone-volume"></i> Показать номер</button>
                                            <div class="collapse multi-collapse" id="multiCollapseExample1">
                                                <div class="card card-body">
                                                <a href={"tel:"+productDetails.phones}>{productDetails.phones}</a>
                                                </div>
                                            </div>    
                                        </div>
                                        {token ?
                                        <>  
                                        <div className="col-xl-12 mt-xl-2">
                                        <hr className="d-block d-xl-none" /> 
                                         
                                        {favorite ?    
                                        <button class="btn col-xl-12 text-white" style={{backgroundColor:"#4dab04"}} onClick={removeFav}><i class="far fa-heart"></i>Удалить из избранного</button>
                                        :
                                        <button class="btn btn-outline-secondary col-xl-12" onClick={addFav}><i class="far fa-heart"></i> Добавить в избранное</button>
                                        }
                                        
                                        </div>
                                        </>
                                        :<></>
                                        }
                                    <div className="col-xl-12 mt-xl-2">
                                        <hr className="d-block d-xl-none" />
                                        <button class="btn btn-outline-danger col-xl-12"  onClick={showModal}><i class="fas fa-exclamation-triangle"></i> Пожаловаться</button>
                                    </div>
                                    </div>
                                    <div className="col-xl-12 mt-xl-2">
                                        <hr />
                                        <a href={"/userAds/"+productDetails.user_id} onMouseOver={{cursor:"pointer"}}>
                                        {productDetails.user != null ?
                                        <>
                                        {productDetails.user?.media?.length ?
                                        <img className="mb-3" src={productDetails.user.media[0].original_url} style={{ borderRadius: "50%", width: "50px", height: "50px" }} />
                                        :
                                        <Avatar size={42} icon={<UserOutlined />} />
                                        }
                                        </>
                                        :<></>
                                        }
                                        <label className="ml-2">{productDetails.user != null ? productDetails.user.name : <></>}
                                        <p className=" border rounded bg-light px-1  text-secondary">{productDetails.user.active_count} объявления пользователя</p>
                                        </label>
                                        </a>
                                        <hr />
                                    </div>
                                    <div className="col-6 col-xl-12 mt-2">
                                        <label className="text-muted"><b>Поделиться</b></label><br />
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
                                        <hr className="d-none d-xl-block" />
                                    </div>
                                    <div className="col-6 col-xl-12 mt-0 mt-xl-2">
                                        <label class="ml-3 text-muted"><i class="far fa-eye"></i> Просмотры: {productDetails.views}<br />
                                            <i class="fas fa-map-marker-alt"></i> Местоположение: {productDetails.region != null ? productDetails.region.name + "," + productDetails.city.name : ""}<br />
                                            <i class="far fa-clock"></i> Обновлено: {update}
                                        </label>
                                    </div>

                                </div>
                                <hr />
                            </div>
                        </div>
                            <div className="col-xl-8 border rounded mt-3 py-3 mb-5">
                            <label style={{fontSize:15}}><b>Комментарии</b></label>
                            {
                                token != null ?
                                    <>
                                        {
                                            productDetails.can_comment == "all" ?
                                                <div className="col-xl-12">
                                                    {
                                                        productDetails.comments?.length
                                                            ? <CommentList comments={productDetails.comments} />
                                                            : <>Нет комментариев</>
                                                    }
                                                    <Comment
                                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                                        content={
                                                            <>
                                                                <Form.Item>
                                                                    <TextArea rows={4}
                                                                        onChange={(e) => { setValue(e.target.value) }} value={value} />
                                                                </Form.Item>
                                                                <Form.Item>
                                                                    {!comment ?
                                                                    <Button className="rounded-pill" htmlType="submit" loading={submitting} onClick={onSubmit} style={{ backgroundColor: "#4dab04", color: "#fff" }}>
                                                                        Добавить комментарий
                                                                    </Button>
                                                                    :
                                                                    <Button className="rounded-pill" htmlType="submit" loading={submitting} onClick={Answer} style={{ backgroundColor: "#4dab04", color: "#fff" }}>
                                                                    Ответить на комментарий
                                                                    </Button>
                                                                    
                                                                    }
                                                                </Form.Item>
                                                            </>
                                                        }
                                                    />

                                                </div>
                                                :
                                                <></>
                                        }
                                    </>
                                    :
                                    <>
                                        <div className="col-xl-12 py-2">
                                                    {
                                                        productDetails.comments?.length
                                                            ? <CommentList comments={productDetails.comments} />
                                                            : <>Нет комментариев</>
                                                    }
                                            <hr/>
                                            <label style={{ fontSize: 14 }}>Чтобы оставить комментарий нужно авторизоваться</label>
                                            <br />
                                            <Button style={{ borderColor: "#4dab04", color: "#4dab04" }}><a href="/login">Войти</a></Button>
                                        </div>
                                    </>
                            }
                        </div>
                </div>
            </> 
            : 
                <div>
                    <center className="py-5">
                    <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                    </center>
                </div>
                
            }
            <Modal
        className="rounded"
        title="ПОЖАЛОВАТЬСЯ"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        width={580}
      >
         <label style={{fontSize:17,fontWeight:"normal"}}>Причина жалобы:</label>
         <Select size={"large"} onChange={handleChange} style={{ width: "100%" }}>
            {childrens?.length?
            <>
            {childrens.map((item)=>
            <>
                <option value={item.id}>{item.name}</option>
            </>
            )}
            </>
            :<></>
            }
         </Select>
         <TextArea className="rounded mt-3" rows={4} placeholder="Напишите, что вам не понравилось в данном объявлении" onChange={(e)=>setComplaintsText(e.target.value)}/>
         <hr/>
         <div className="text-right">
            <button className="btn btn-outline-light border text-dark mr-2" onClick={handleCancel}>Закрыть</button>
            <button className="btn text-white" style={{backgroundColor:"#4dab04"}}  onClick={PostComplaint}>Пожаловаться</button>
         </div>
      </Modal>
        </div>
    );
}

export default Ad;