import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user_store";
import { useEffectOnce } from "react-use";
import Navbar from "../ui/components/navbar";
import top from '../dist/img/topbanner.png';
import Footer from "../ui/components/footer";

export default function Layout({ requireAuth = false }) {
    const auth = useUserStore();
    const location = useLocation();

    // console.log(auth)

    useEffectOnce(() => {
        auth.checkAuth()
    })

    if (!auth.isAuthenticated && requireAuth && (!location.pathname.includes('/login') || !location.pathname.includes('/register'))) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
        <div className='bg-white p-0 m-0'>
            <div className="col-lg-12 bg-success px-0 text-white text-center">
                <img src={top} width="100%" />
            </div>
            <Navbar />
            <div className="container-fluid p-0">

                <div className="row">
                    <div className="col-1-5 px-0 d-none d-lg-block text-white text-center d-md-none"
                        style={{
                            backgroundSize: "auto", backgroundPosition: "right top",
                            backgroundImage: "",
                            backgroundRepeat: "no-repeat"
                        }}>
                    </div>

                    <div className="col-lg-9  col-md-12 col-sm-12 col-xs-12 md:px-[75px] lg:px-0 sm:px-[75px]"
                        style={{ backgroundColor: '#fff', minHeight: "500px" }}>
                        <AuthStatus />
                        <Outlet />
                    </div>

                    <div className="col-1-5 px-0 d-none d-lg-block text-white text-center d-md-none"
                        style={{
                            backgroundSize: "auto",
                            backgroundImage: "",
                            backgroundRepeat: "no-repeat"
                        }}>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

function AuthStatus() {
    let auth = useUserStore();
    let navigate = useNavigate();

    if (!auth?.user) {
        return <></>;
    }

    return (
        <></>
    );
}

function RequireAuth({ children }) {
    let auth = useUserStore();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
