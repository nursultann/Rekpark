import React, { useMemo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as api from "../../../api";
import ProductItem from "../../components/product/user_product_item";
import { subscriptions } from "../../../api/product";
import { setProductPlans } from "../../../redux/actions/productPlans_actions";
import { cancelBussinessAccount } from "../../../api/bussiness";
import { useUserStore } from "../../../store/user_store";
import { useEffectOnce, useLocation } from "react-use";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useCallback } from "react";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const auth = useUserStore()

    const location = useLocation()

    const user = auth.user;
    const [products, setProducts] = useState([]);
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const tab = useMemo(() => {
        if (location.hash) {
            return location.hash.replace('#', '')
        }
        return 'active'
    }, [location])

    const fetchPlans = async () => {
        const plans = await subscriptions();
        if (plans != null) {
            dispatch(setProductPlans(plans));
        }
    }

    const fetchProducts = async () => {
        let data = await api.fetchUserProducts({ 'sort': tab });
        if (data != null) {
            setProducts(data);
            setOffset(offset + limit);
        }
    };

    const cancelBussiness = async () => {
        const cancel = await cancelBussinessAccount();


        setTimeout(() => {
            window.location.href = `/profile`;
        }, 1200);

    }

    useEffectOnce(() => {
        document.title = "Мои объявления";

        fetchProducts();
        fetchPlans();
        auth.fetchUser();
    });


    const activeLink = useCallback((path, borderColor, bgColor, textColor) => {
        return classNames(
            'h-[45px] px-5 w-full py-2.5 rounded-[10px] justify-center items-center gap-2.5 inline-flex',
            {
                [`${bgColor} text-white `]: tab === path,
                [`border ${borderColor} ${textColor} `]: tab !== path
            }
        )
    }, [location])

    return (
        <>
            <div className="flex flex-row justify-content-around items-center mt-[50px] gap-4">
                <Link
                    className={activeLink("active", 'border-green-500', 'bg-green-500', 'text-green-500')}
                    to="/profile/list#active"
                    type="button"
                >
                    <div className="text-center text-sm font-medium font-['SF UI Display'] leading-snug">Активные</div>
                </Link>

                <Link
                    className={activeLink("inactive", 'border-red-500', 'bg-red-500')}
                    to="/profile/list#inactive"
                    type="button"
                >
                    Неактивные
                </Link>

                <Link
                    className={activeLink("moderation", 'border-yellow-500', 'bg-yellow-500')}
                    to="/profile/list#moderation"
                    type="button"
                >
                    Модерация
                </Link>

                <Link
                    className={activeLink("disabled", 'border-gray-500', 'bg-gray-500')}
                    to="/profile/list#disabled"
                    type="button"
                >
                    Отключенные
                </Link>
            </div>

            <div className="mt-[40px] grid grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-4">
                {products.map((product, index) => {
                    return (
                        <div key={index}>
                            <ProductItem
                                product={product}
                                index={index}
                                onEdit={() => {
                                    window.location.href = `/edit/${product.id}`;
                                }}
                                onDelete={() => {
                                    window.location.href = `/delete/${product.id}`;
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default ProfilePage;