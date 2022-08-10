import { Avatar } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchUsersProducts } from '../api/product';
import Navbar from '../components/navbar';
import ProductItem from "../components/product/product_item";
import moment from 'moment';
import { useDispatch } from 'react-redux';
const UserAds = ({ match }) => {
    const [product, setProducts] = useState()
    const [user, setUser] = useState();
    const fetchProducts = async () => {
        const _products = await fetchUsersProducts({
            'search': 'user_id:' + match.params.id,
            'searchFields': 'user_id:=',
            'with': 'user'
        });
        if (_products != null) {
            setProducts(_products);
            console.log(product[0]);
        }
    }
    useEffect(() => {
        fetchProducts();
    }, [])
    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a className="text-primary" href="/"><i class="fa-solid fa-house"></i> Главная страница</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Объявления пользователя</li>
                            </ol>
                        </nav>
                        <div className="row mt-4 px-2">
                            <div className='col-xl-12 border rounded py-3'>
                                {product != null || product != undefined ?
                                    <>
                                        <div className="col-xl-6">
                                            <div className='row'>
                                                <div className='col-1'>
                                                    {product[0].user.image == null ?
                                                        <Avatar size={100} icon={<UserOutlined />} />
                                                        : <img src={product[0].user.image} className="rounded-circle" width='50' height='50' />
                                                    }
                                                </div>
                                                <div className='col-9 ml-1 px-4'>
                                                    <label className='ml-2 text-muted'><span className='text-dark'>{product[0].user.name}</span><br />
                                                        Аккаунт создан {moment(product[0].user.created_at, "YYYYMMDD").fromNow()}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-6'>

                                        </div>
                                    </> : <></>
                                }
                            </div>
                            <div className='col-xl-12 border rounded my-3 py-3'>
                            {product != null || product != undefined ?
                                <>
                                {
                                    product[0].user.is_business_account ? 
                                    <>
                                    Это бизнес профиль
                                    
                                    </>
                                    :
                                    <></>
                                }
                                </>
                                :<></>
                            }
                            </div>
                            <div className='col-xl-12 border rounded py-3 mt-4'>
                                <label style={{ fontSize: 18 }}><b>Объявления</b></label>
                                <hr />
                                <div className='row'>
                                    {product != null && product != undefined ?
                                        product.map((item) => (
                                            <div className="col-xs-12 col-sm-6 col-xl-3 mt-3">
                                                <ProductItem product={item} />
                                            </div>
                                        ))
                                        : <div className='col-12 text-center py-5'>
                                            <div class="spinner-border text-success" role="status">
                                                <span class="visually-hidden"></span>
                                            </div>

                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserAds;