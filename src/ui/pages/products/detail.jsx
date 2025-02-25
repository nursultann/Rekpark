import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button, Input, message, Select, notification, Image } from 'antd';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { useEffectOnce } from "react-use";
import {
    addToFavorites,
    fetchChatByPartner,
    getComplaints,
    postComplaints,
    postUserMessage,
    removeFromFavorites,
} from "../../../api";
import { setProductDetails } from "../../../redux/actions/product_actions";
import { useProductDetailsQuery } from "../../../hooks/product";
import DetailsImageCarousel from "./contents/details_image_carousel";
import BorderedTile from "./contents/bordered_tile";
import CommentsBlock from "./contents/comments_bloc";
import { useUserStore } from "../../../store/user_store";
import Conditional from "../../components/conditional";
import UserTile from "./contents/user_tile";
import QuickMessages from "./contents/quick_message";
import ShareButtons from "./contents/share_buttons";
import ProductDetails from "./contents/product_details";

const key = "updateable";
const { TextArea } = Input;
const { Option } = Select;

var DG = require('2gis-maps');

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
    const [chatId, setChatId] = useState();
    const [location, setLocation] = useState(undefined);
    const [map1, setMap1] = useState(<div id="map" style={{ width: "100%", height: "400px" }}></div>);

    useEffect(() => {
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
            setFavorite(productDetails.is_favorite);
            // dispatch(setProductUserDetails(productDetails.user));

            var position = productDetails.location;
            if (position != undefined) {
                const location = JSON.parse(position);
                setLocation(location);

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

            document.title = productDetails.title;
        }
    }, [productDetails]);


    useEffectOnce(() => {
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

    const postQuickMessage = async (message) => {
        if (message) {
            if (!chatId) {
                const chat = await fetchChatByPartner(productDetails.user_id);
                if (chat) {
                    setChatId(chat.id);
                }
            }

            const sendMessage = await postUserMessage({ 'user_id': productDetails.user_id, 'message': message, 'advertisement_id': productDetails.id });

            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    var time = moment(productDetails.created_at, 'YYYYMMDD, H:mm:ss');
    var update = time.fromNow();
    const phones = productDetails.phones;
    return (
        <ProductDetails product={productDetails} />
    );
}

export default ProductDetailPage;