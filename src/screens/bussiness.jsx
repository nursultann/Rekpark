import React, { useEffect, useState } from "react";
import { fetchBussinessPlans } from "../api/bussiness.js";
import BussinessItem from "../components/bussiness/bussiness_item.jsx";
import Navbar from "../components/navbar";

const SetBussinessProfile = () => {
    if(localStorage.getItem('token') == null){
        window.location.href = "/";
    }
    const [plans, setPlans] = useState();
    const BussinessPlans = async () => {
        const plan = await fetchBussinessPlans();
        if (plan != null) {
            setPlans(plan);
            console.log(plans);
        }
    }
    useEffect(() => {
        BussinessPlans();
    })
    return (
        <>
            <Navbar />
            <div className="col-xl-12 py-3">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a className="text-primary" href="/"><i class="fa-solid fa-house"></i> Главная страница</a></li>
                        <li class="breadcrumb-item active" aria-current="page"><a className="text-primary" href="/profile">Профиль</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Бизнес профиль</li>
                    </ol>
                </nav>
                <div className="row pt-2">
                    <div className="col-xl-12">
                        <h5>Выберите бизнес план</h5>
                        <hr />
                    </div>
                </div>
                <div className="row px-4 pb-3">
                    <div className="col-xl-12 py-3 border rounded">
                        <div className="row">
                            {plans != null ?
                                <>
                                    {plans.map((item) =>
                                        <BussinessItem product={item} />
                                    )}
                                </>
                                : <>
                                    <div className="col-12 py-5 text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SetBussinessProfile;