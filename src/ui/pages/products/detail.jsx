import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Carousel from 'react-gallery-carousel';
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, TelegramIcon } from "react-share";
import { Modal, Comment, Avatar, Form, Button, List, Input, message, Select, notification, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { useEffectOnce } from "react-use";
import {
    addToFavorites,
    answerComment,
    deleteComments,
    getComplaints,
    postComplaints,
    removeFromFavorites,
    createComment,
    userDetails,
    postUserMessage
} from "../../../api";
import { setProductDetails } from "../../../redux/actions/product_actions";
import { useProductDetailsQuery } from "../../../hooks/product";
import DetailsImageCarousel from "./contents/details_image_carousel";
import BorderedTile from "./contents/bordered_tile";
import CommentsBlock from "./contents/comments_bloc";
import { useUserStore } from "../../../store/user_store";
import Conditional from "../../components/conditional";
import UserTile from "./contents/user_tile";

const key = "updateable";
const { TextArea } = Input;
const { Option } = Select;

const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};

const ProductDetailPage = ({ match }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useUserStore();
    const isAuth = isAuthenticated;

    const params = useParams();
    const query = useProductDetailsQuery(params.id);
    const productDetails = query.product;

    const [favorite, setFavorite] = useState();
    const [complaintsText, setComplaintsText] = useState();
    const [reason, setReason] = useState();
    const [childrens, setChildrens] = useState();
    const [loadings, setLoadings] = useState();
    const [messag, setMessage] = useState();
    const [chat_id, setChatId] = useState();
    const [phones, setPhones] = useState();
    const [location, setLocation] = useState(undefined);
    const [map1, setMap1] = useState(<div id="map" style={{ width: "100%", height: "400px" }}></div>);

    useEffect(() => {
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
            setFavorite(productDetails.is_favorite);
            // dispatch(setProductUserDetails(productDetails.user));

            setChatId(productDetails.user_id);
            setPhones(productDetails.phones);
            var position = productDetails.location;
            if (position != undefined) {
                setLocation(JSON.parse(position));
            }
            // console.log('product',productDetails);
            document.title = productDetails.title;
        }
    }, [productDetails]);


    useEffectOnce(() => {
        //map
        if (location) {
            var DG = require('2gis-maps');
            var map;
            var marker;
            DG.then(function () {
                map = DG.map('map', {
                    'center': [location.latitude, location.longitude],
                    'zoom': 13
                });
                DG.marker([location.latitude, location.longitude]).addTo(map);
            });
        }

        moment.locale('ru');
    });


    //reason
    const fetchComplaints = async () => {
        const complaints = await getComplaints();
        if (complaints != null) {
            setChildrens(complaints);
        }
        // const childrens = [];
        // for (let i = 10; i < 36; i++) {
        //   childrens.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        // }
    }

    //comments
    const token = localStorage.getItem('token');

    const addFav = async () => {
        const addToFav = await addToFavorites(productDetails.id);
        message.success({ content: 'Добавлено в избранное!', key, duration: 2 });
        setFavorite(true);
    }

    const removeFav = async () => {
        const addToFav = await removeFromFavorites(productDetails.id);
        message.error({ content: 'Удалено из избранного!', key, duration: 2 });
        setFavorite(false);
    }

    useEffectOnce(() => {
        fetchComplaints();
    });

    //complaints
    const PostComplaint = async () => {
        const params = {
            'complaint_type_id': reason,
            'text': complaintsText,
            'advertisement_id': productDetails.id
        }
        const postComplaint = await postComplaints(params);
        message.success("Ваше обращение отправлено!", 1000);
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

    }

    const postMessage = async () => {
        setLoadings(true);
        if (messag != "" && messag != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': messag, 'advertisement_id': match.params.id });
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }

    const postQuickMessage = async (messag) => {
        setLoadings(true);
        if (messag != "" && messag != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': messag, 'advertisement_id': match.params.id });
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }

    if (query.isLoading) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="text-2xl font-bold">Loading...</div>
            </div>
        )
    }

    if (productDetails == null) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="text-2xl font-bold">Product not found</div>
            </div>
        )
    }

    var time = moment(productDetails.created_at, 'YYYYMMDD, H:mm:ss');
    var update = time.fromNow();

    return (
        <div>
            <div className="col-xl-12 mt-xl-3 mt-[50px]">

                <div className="row ">
                    <div className="col-xl-8 py-3">
                        <div className="row">
                            <div className="col-xl-12">
                                <label className="text-blue-600 text-xl font-semibold mb-[25px]">
                                    {productDetails.title}
                                </label>

                                {productDetails.media.length > 0 ?
                                    <DetailsImageCarousel
                                        images={productDetails.media.map((item) => item.original_url)}
                                        className='h-[500px] w-full object-cover rounded-xl transition-all duration-300 '
                                    />
                                    :
                                    <div className="col-12 border rounded p-1">
                                        <Image
                                            width={"100%"}
                                            height={500}
                                            src="error"
                                            className="rounded-xl object-cover"
                                            fallback="data:image/png;base64,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"
                                        />
                                    </div>
                                }
                            </div>

                            <div className="flex flex-col gap-[10px] mt-[35px]">
                                <BorderedTile title='Категория:' >
                                    {productDetails.category_tree?.map((item) => (
                                        <span>
                                            <Link to={"/category/" + item.id} className="">
                                                {item.name}
                                            </Link>
                                            <span className="mx-1">/</span>
                                        </span>
                                    ))}
                                    <Link to={"/category/" + productDetails.category.id} className="">
                                        {productDetails.category.name}
                                    </Link>
                                </BorderedTile>

                                <BorderedTile title='Цена:'>
                                    {productDetails.priceWithCurrency}
                                </BorderedTile>

                                <BorderedTile title='Описание:'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl sit amet aliquet ultricies, nunc nisl ultricies nunc, sit amet aliquet nisl nisl sit amet nisl. Nulla euismod, nisl sit amet aliquet ultricies, nunc nisl ultricies nunc, sit amet aliquet nisl nisl sit amet nisl. Nulla euismod, nisl sit amet aliquet ultricies, nunc nisl ultricies nunc, sit amet aliquet nisl nisl sit amet nisl. Nulla euismod, nisl sit amet aliquet ultricies, nunc nisl ultricies nunc, sit amet aliquet nisl nisl sit amet nisl. Nulla euismod, nisl sit amet aliquet ultricies, nunc nisl ultricies nunc, sit amet aliquet nisl nisl sit amet nisl.
                                </BorderedTile>

                                <BorderedTile title='Город:'>
                                    {productDetails.city.name}
                                </BorderedTile>
                                {productDetails.district && (
                                    <BorderedTile title='Район:'>
                                        {productDetails.district.name}
                                    </BorderedTile>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    {productDetails.custom_attributes?.map((item) => (
                                        <BorderedTile title={item.attribute.name}>
                                            {item.value}
                                        </BorderedTile>
                                    ))}
                                </div>


                            </div>
                        </div>

                    </div>

                    <div className="col-xl-4">
                        <div className="col-xl-12 border rounded-2xl mt-3">
                            <div className="row">
                                <div className="col-xl-12 mt-xl-4">
                                    <hr className="d-block d-xl-none" />
                                    <button
                                        className="w-full  rounded-2xl py-[12px]  flex flex-row gap-2 justify-center items-center bg-blue-600 text-white"
                                        data-toggle="collapse"
                                        href="#multiCollapseExample1"
                                        role="button"
                                        aria-expanded="false"
                                        aria-controls="multiCollapseExample1">
                                        <i className="fa-solid fa-phone"></i> <span>Показать номер</span>
                                    </button>

                                    <div className="collapse multi-collapse" id="multiCollapseExample1">
                                        <div className="card card-body">
                                            {phones != null && phones.length > 12 ?
                                                <>
                                                    {phones.split(",").map((item) =>
                                                        <a href={"tel:" + item}>{item}</a>
                                                    )}
                                                </>
                                                :
                                                <a href={"tel:" + phones}>{phones}</a>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <Conditional condition={isAuth}>
                                    <div className="col-xl-12 mt-xl-2">
                                        {favorite ?
                                            <button
                                                className="w-full rounded-2xl py-[12px] flex flex-row gap-2 justify-center items-center text-white bg-yellow-500"
                                                onClick={removeFav}
                                            >
                                                <i className="fa-solid fa-star text-error"></i> Удалить из избранного
                                            </button>
                                            :
                                            <button
                                                className="col-xl-12 w-full rounded-2xl py-[12px] flex flex-row gap-2 justify-center items-center border border-gray-300"
                                                onClick={addFav}
                                            >
                                                <i className="fa-regular fa-star"></i> Добавить в избранное
                                            </button>
                                        }
                                    </div>
                                </Conditional>

                                <div className="col-xl-12 mt-xl-2">
                                    <button
                                        className="w-full rounded-2xl py-[12px] flex flex-row gap-2 justify-center items-center text-white bg-red-500"
                                        onClick={showModal}
                                    >
                                        <i className="fas fa-exclamation-triangle"></i> Пожаловаться
                                    </button>
                                </div>
                            </div>

                            <div className="col-xl-12 mt-[24px]">
                                <hr />
                                <div className="my-[20px]">
                                    <UserTile user={productDetails.user} />
                                </div>
                                <hr />
                            </div>

                            <div className="col-6 col-xl-12 my-[25px]">
                                <label className="text-muted">Поделиться</label>
                                <br />
                                <div className="flex flex-row gap-2">
                                    <FacebookShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button mr-1"
                                    >
                                        <FacebookIcon size={45} round />
                                    </FacebookShareButton>
                                    <WhatsappShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button mr-1"
                                    >
                                        <WhatsappIcon size={45} round />
                                    </WhatsappShareButton>
                                    <TelegramShareButton
                                        url={window.location.href}
                                        quote={"フェイスブックはタイトルが付けれるようです"}
                                        hashtag={"#hashtag"}
                                        description={"aiueo"}
                                        className="Demo__some-network__share-button"
                                    >
                                        <TelegramIcon size={45} round />
                                    </TelegramShareButton>
                                </div>
                            </div>

                            <hr className="d-none d-xl-block" />

                            <div className="col-xl-12 mt-[20px] mb-3">
                                <div className="flex flex-col gap-1 justify-center text-zinc-500 text-[15px] font-medium">
                                    <div className="flex flex-row gap-2 items-center">
                                        <i className="fa-regular fa-eye"></i> <span>Просмотры: {productDetails.views}</span>
                                    </div>

                                    <div className="flex flex-row gap-2 items-center">
                                        <i className="fa-regular fa-clock"></i> <span>Обновлено: {update}</span>
                                    </div>

                                    <div className="flex flex-row gap-2 items-center">
                                        <i className="fa-regular fa-star"></i> <span>Сохранили: {productDetails.fav_count}</span>
                                    </div>

                                    <div className="flex flex-row gap-2 items-center">
                                        <i className="fas fa-map-marker-alt"></i> <span>Местоположение: {productDetails.region != null ? productDetails.region.name + "," + productDetails.city.name : ""} </span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {isAuth &&
                            <div className="col-xl-12 p-2">

                                <div
                                    className="w-full text-center rounded-xl items-center justify-center flex p-2"
                                    style={{ border: '2px dashed #000000' }}
                                >
                                    <span>
                                        Написать сообщение к {productDetails.user.name}
                                    </span>
                                </div>

                                <div className="col-xl-12 mt-2 px-0">
                                    <textarea rows="10"
                                        className="form-control"
                                        value={messag}
                                        onChange={(e) => { setMessage(e.target.value) }}
                                        placeholder="Написать что-нибудь"
                                    ></textarea>
                                    <div className="flex flex-col gap-2 justify-center items-center mt-2 text-white">
                                        <button
                                            className="rounded-xl w-full btn btn-primary text-white"
                                            onClick={postMessage}
                                        >
                                            Отправить
                                        </button>
                                        <button className="btn btn-warning rounded-xl w-full" onClick={() => postQuickMessage("Еще актуально?")}>
                                            Еще актуально?
                                        </button>
                                        <button className="btn btn-warning rounded-xl w-full" onClick={() => postQuickMessage("Обмен интересует?")}>
                                            Обмен интересует?
                                        </button>
                                        <button className="btn btn-warning rounded-xl w-full" onClick={() => postQuickMessage("Торг возможен?")}>
                                            Торг возможен?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        <hr />
                        {location != null &&
                            <div className="col-xl-12">
                                <p>Местоположение</p>
                                {map1}
                            </div>
                        }
                    </div>
                </div>

                <div className="row xl:mt-[30px]">
                    <div className="col-xl-8 m-0 p-0">
                        <div className="text-neutral-800 text-xl">Комментарии</div>

                        <CommentsBlock product={productDetails} />
                    </div>
                </div>

                <div className="h-[100px]"></div>

            </div>

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
                <label style={{ fontSize: 17, fontWeight: "normal" }}>Причина жалобы:</label>
                <Select size={"large"} onChange={handleChange} style={{ width: "100%" }}>
                    {childrens?.length ?
                        <>
                            {childrens.map((item) =>
                                <>
                                    <option value={item.id}>{item.name}</option>
                                </>
                            )}
                        </>
                        : <></>
                    }
                </Select>
                <TextArea className="rounded mt-3" rows={4} placeholder="Напишите, что вам не понравилось в данном объявлении" onChange={(e) => setComplaintsText(e.target.value)} />
                <hr />
                <div className="text-right">
                    <button className="btn btn-outline-light border text-dark mr-2" onClick={handleCancel}>Закрыть</button>
                    <button className="btn text-white" style={{ backgroundColor: "#184d9f" }} onClick={PostComplaint}>Пожаловаться</button>
                </div>
            </Modal>
            <div className="fixed-bottom d-block d-md-none">
                <div className="row">
                    <button className="btn col-6 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i className="fas fa-phone-volume"></i> Позвонить</button>
                    <button className="btn col-6 text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} data-toggle="collapse" href="#multiCollapseExample2" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i className="fa-solid fa-envelope"></i> Написать</button>
                    <div className="col-12">
                        <div className="collapse multi-collapse" id="multiCollapseExample1">
                            <div className="card card-body bg-white">
                                {phones != null && phones.length > 12 ?
                                    <>
                                        {phones.split(",").map((item) =>
                                            <a href={"tel:" + item}>{item}</a>
                                        )
                                        }
                                    </>
                                    :
                                    <>
                                        <a href={"tel:" + phones}>{phones}</a>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="collapse multi-collapse" id="multiCollapseExample2">
                            {token ?
                                <div className="col-xl-12 bg-white border rounded p-2">
                                    <div className="col-xl-12 text-center" style={{ backgroundColor: "rgb(9, 72, 130)" }}>
                                        <label className="p-2 rounded text-white">Написать сообщение к {productDetails?.user?.name}</label>
                                    </div>
                                    <div className="col-xl-12 mt-2 px-0">
                                        <textarea rows="10" className="form-control" value={messag} onChange={(e) => { setMessage(e.target.value) }}></textarea>
                                        <Button loading={loadings} className="btn btn-outline-primary rounded col-12 mt-2" onClick={postMessage}>Отправить</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Еще актуально?")}>Еще актуально?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Обмен интересует?")}>Обмен интересует?</Button>
                                        <Button className="btn text-white rounded mt-2 col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => postQuickMessage("Торг возможен?")}>Торг возможен?</Button>
                                    </div>
                                </div>
                                : <div className="bg-white">Авторизуйтесь сначала чтобы написать</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;