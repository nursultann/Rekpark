import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { fetchUsersProducts } from '../api/product';

const UserAds = ({match})=>{
    const [products,setProducts] = useState();
    const fetchProducts = async () =>{
        const params = {
            'search': 'user_id:'+match.params.id,
            'searchFields':'user_id:=',
        }
        console.log("Params",params);
        const _products = await fetchUsersProducts(params);
        if(_products!=null){
            setProducts(_products);
        }
    }
    useEffect(() => {
        fetchProducts();
      }, []);
    return(
        <div>
            <div className="container-fluid">
                <div className="row">
                     <div className="col-xl-12">
                         <div className="row mt-4 px-2">
                            <div className='col-xl-12 border rounded py-3'> 
                                <div className="col-xl-6">
                                    <Avatar size={100} icon={<UserOutlined />} />
                                    <label className='ml-2'><b>User</b></label>
                                </div>
                                <div className='col-xl-6'>
                                    
                                </div>
                            </div>
                            <div className='col-xl-12 border rounded py-3 mt-4'>
                                <label style={{fontSize:18}}><b>Объявления</b></label>
                                <div className='row'>

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