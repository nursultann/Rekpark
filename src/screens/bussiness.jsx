import React, { useEffect, useState } from "react";
import { fetchBussinessPlans } from "../api/bussiness.js";
import BussinessItem from "../components/bussiness/bussiness_item.jsx";
import Navbar from "../components/navbar";

const SetBussinessProfile = () => {
    if (localStorage.getItem('token') == null) {
        window.location.href = "/";
    }
    const [plans, setPlans] = useState();
    const [periodId, setPeriodId] = useState();
    const [planId, setPlanId] = useState();
    const [itemPrice, setItemPrice] = useState(0);
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [sites, setSite] = useState();
    const [period,setPeriod] = useState(1);
    const BussinessPlans = async () => {
        const plan = await fetchBussinessPlans();
        if (plan != null) {
            setPlans(plan);
            // console.log(plans);
        }
        console.log(plans);
    }
    const setTime = (time)=>{
        setPeriod(time);
        console.log(period);
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
                            <div className="col-12 d-flex justify-content-center mb-3">
                                <div className="col-8 d-flex justify-content-center">
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(1) }}>1 месяц</button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(3) }}>3 месяца</button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(6) }}>6 месяцев</button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-primary" onClick={() => { setTime(12) }}>1 год</button>
                                    </div>
                                </div>
                            </div>
                            {plans != null ?
                                <>
                                    {plans.map((item) =>
                                        <div className="col-lg-4">
                                            <div className="border">
                                                <div class="card-body">
                                                    <h5 class="card-title">{item.name}</h5>
                                                    <hr />
                                                    <h6 class="card-subtitle mb-2 text-center py-4"><BussinessItem product={item.periods} period = {period}/> / <small className="text-muted label">месяц</small></h6>
                                                    <a href="#" class="btn btn-primary rounded-pill col-12 text-white">Подключить</a>
                                                    <hr />
                                                    <div className="border p-2 rounded">
                                                        <span className="label"><strong>Описание</strong></span>
                                                        <p class="card-text label text-muted">{item.description}</p>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                                :
                                <>
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