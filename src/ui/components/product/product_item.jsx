import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from '@mui/material';
import moment from 'moment';
import { useEffectOnce } from "react-use";
import { maxSymbolEllipsis } from "../../../helpers/functions";
import { setProductDetails } from "../../../redux/actions/product_actions";
import chat_bubble_outline from '../../../dist/icons/chat_bubble.svg';
import heart_outline from '../../../dist/icons/heart_outline.svg';
import '../../../dist/css/custom_card.css';
import ProductImagesSlider from "./images_slider";
import classNames from "classnames";


const ProductItem = ({ product, onClick, border = true }) => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history(`/products/${product.id}`);
    };

    let baseStyle = {
        height: 'auto',
    };

    if (product.is_vip) {
        baseStyle.border = "1px solid #fecb00";
    } else if (product.is_urgent) {
        baseStyle.border = "1px solid #ff3b30";
    } else {
        baseStyle.border = "";
    }

    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }

    useEffectOnce(() => {
        moment.locale('ru');
    });

    return (
        <div
            className={classNames(
                "max-w-md pb-2.5 rounded-[10px] flex-col justify-start items-center  cursor-pointer ",
                {
                    "border-2 border-neutral-200 hover:border-primary-500 hover:bg-gray-50 active:bg-gray-100": border,
                }
            )}
            style={baseStyle}
            onClick={() => {
                console.log('product', 'product');
                navigateToProductDetailsPage(product)
            }}
        >
            <div
                className="w-[100%] h-[190px] rounded-tl-[10px] rounded-tr-[10px] border-neutral-200"
                style={{ objectFit: 'cover' }}
            >
                {product.media?.length ?
                    (<ProductImagesSlider
                        images={[
                            ...product.media.map((item) => item.original_url),
                            product.imageOrDefault
                        ]}
                        className="h-[190px] w-full object-cover rounded-tl-[10px] rounded-tr-[10px]"
                    />) :
                    <img
                        className="h-full w-full object-cover rounded-tl-[10px] rounded-tr-[10px]"
                        src={product.imageOrDefault}
                    />}
            </div>


            <div className="self-stretch flex-col justify-start items-start px-1 px-lg-3 mt-2">

                <div className="flex-col justify-center items-start gap-[4.85px] flex">
                    <div className="text-neutral-800 text-sm font-medium">{product.title}</div>

                    <div
                        className="h-[40px] text-neutral-400 text-xs font-medium font-['SF UI Display']"
                    >
                        {maxSymbolEllipsis(product.description, 70)}
                    </div>
                    <div className="text-neutral-800 text-xs font-medium font-['SF UI Display'] mt-1">
                        {product.priceWithCurrency}
                    </div>
                </div>

                <div className="justify-start items-center gap-[5px] inline-flex mt-3">
                    <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">
                        Регион: {product.city?.name}
                    </div>
                </div>

                <div className="flex flex-row items-center justify-content-between">
                    <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">
                        {moment(product.created_at).fromNow()}
                    </div>

                    <div className="flex flex-row items-center justify-content-between gap-[5px]">
                        <div className="flex flex-row items-center justify-content-between gap-[5px]">
                            <img src={chat_bubble_outline} alt="chat_bubble_outline" />
                            <div className="text-neutral-800 text-[12px] font-normal font-['SF UI Display']">10</div>
                        </div>
                        <div className="flex flex-row items-center justify-content-between gap-[5px]">
                            <img src={heart_outline} alt="heart_outline" />
                            <div className="text-neutral-800 text-[12px] font-normal font-['SF UI Display']">50</div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
};

export function ProductItemSkeleton() {
    return (
        <div className="max-w-md pb-2.5 rounded-[10px] border-2 border-neutral-200 flex-col justify-start items-center hover:border-primary-500 cursor-pointer hover:bg-gray-50 active:bg-gray-100">
            <div
                className="w-[100%] h-[190px] rounded-tl-[10px] rounded-tr-[10px] border-neutral-200"
                style={{ objectFit: 'cover' }}
            >
                <Skeleton variant="rectangular" width="100%" height="100%" />
            </div>

            <div className="self-stretch flex-col justify-start items-start px-3 mt-2">

                <div className="flex-col justify-center items-start gap-[4.85px] flex">
                    <div className="text-neutral-800 text-sm font-medium">
                        <Skeleton variant="text" width="100px" />
                    </div>

                    <div
                        className="h-[40px] text-neutral-400 text-xs font-medium font-['SF UI Display']"
                    >
                        <Skeleton variant="text" width={'auto'} />
                    </div>
                    <div className="text-neutral-800 text-xs font-medium font-['SF UI Display'] mt-1">
                        <Skeleton variant="text" />
                    </div>
                </div>

                <div className="justify-start items-center gap-[5px] inline-flex mt-3">
                    <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">
                        <Skeleton variant="text" width="50px" />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-content-between">
                    <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">
                        <Skeleton variant="text" width="50px" />
                    </div>

                    <div className="flex flex-row items-center justify-content-between gap-[5px]">
                        <div className="flex flex-row items-center justify-content-between gap-[5px]">
                            <img src={chat_bubble_outline} alt="chat_bubble_outline" />
                            <div className="text-neutral-800 text-[15px] font-normal font-['SF UI Display']">
                                <Skeleton variant="text" width="10px" />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-content-between gap-[5px]">
                            <img src={heart_outline} alt="heart_outline" />
                            <div className="text-neutral-800 text-[15px] font-normal font-['SF UI Display']">
                                <Skeleton variant="text" width={'10px'} />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    )
}

export default ProductItem;