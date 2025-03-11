import React from "react";
import { useDispatch } from "react-redux";
import moment from 'moment';
import { useEffectOnce } from "react-use";
import { maxSymbolEllipsis } from "../../../helpers/functions";
import { setProductDetails } from "../../../redux/actions/product_actions";
import chat_bubble_outline from '../../../dist/icons/chat_bubble.svg';
import heart_outline from '../../../dist/icons/heart_outline.svg';
import ProductImagesSlider from "./images_slider";
import classNames from "classnames";

const ProductItem = ({ product, onClick, border = true }) => {
    const dispatch = useDispatch();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        window.location.href = `/products/${product.id}`;
    };

    useEffectOnce(() => {
        moment.locale('ru');
    });

    const getBorderStyle = () => {
        // if (product.is_vip) return "border-yellow-400";
        if (product.is_urgent) return "border-red-400";
        return "border-neutral-200";
    };

    const formatDate = (date) => {
        if (!date) return "";
        if (moment(date).isSame(new Date(), 'day')) {
            return moment(date).fromNow();
        }
        return moment(date).format("DD.MM.YYYY");
    }

    return (
        <div
            className={classNames(
                "w-full rounded-xl flex flex-col cursor-pointer transition-all duration-200",
                "hover:shadow-lg transform hover:-translate-y-1",
                border ? `border-2 ${getBorderStyle()}` : "",
            )}
            onClick={() => navigateToProductDetailsPage(product)}
        >
            {/* Status Badges */}
            <div className="absolute top-2 left-2 z-10 flex gap-2">
                {product.is_vip && (
                    <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-lg font-medium">
                        VIP
                    </span>
                )}
                {product.is_urgent && (
                    <span className="bg-red-400 text-white text-xs px-2 py-1 rounded-lg font-medium">
                        Срочно
                    </span>
                )}
            </div>

            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] rounded-t-xl overflow-hidden">
                {product.media?.length ? (
                    <ProductImagesSlider
                        images={product.media.map((item) => item.original_url)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Нет фото</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-gray-900 font-medium line-clamp-2 mb-2">
                    {product.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {maxSymbolEllipsis(product.description, 70)}
                </p>

                {/* Price */}
                <div className="text-gray-900 font-semibold mb-4">
                    {product.price?.toLocaleString()} {product.currency_symbol}
                </div>

                {/* Footer Stats */}
                <div className="mt-auto">
                    {/* Location */}
                    {product.city?.name && (
                        <div className="text-gray-500 text-sm mb-2">
                            {product.city.name}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            {formatDate(product.created_at)}
                        </span>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <img src={chat_bubble_outline} alt="comments" className="w-4 h-4" />
                                <span className="text-gray-600">{product.comments_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src={heart_outline} alt="favorites" className="w-4 h-4" />
                                <span className="text-gray-600">{product.fav_count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function ProductItemSkeleton() {
    return (
        <div className="w-full rounded-xl border-2 border-neutral-200 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-4/5 mb-2" />
                <div className="h-12 bg-gray-200 rounded w-full mb-3" />
                <div className="h-6 bg-gray-200 rounded w-2/5 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-4" />
                        <div className="h-4 bg-gray-200 rounded w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;