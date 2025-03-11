import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user_store";
import { useEffectOnce } from "react-use";

import SignInDialog from "../ui/pages/auth/sign_in_dialog";
import SignUpDialog from "../ui/pages/auth/sign_up_dialog";

import Navbar from "../ui/components/navbar";
import top from '../dist/img/topbanner.png';
import Footer from "../ui/components/footer";


export default function Layout({ requireAuth = false }) {
    const auth = useUserStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffectOnce(() => {
        auth.checkAuth()
    })

    useEffect(() => {
        if (!auth.isAuthenticated && requireAuth &&
            !location.pathname.includes('/login') &&
            !location.pathname.includes('/register')) {
            handleShowSignIn();
        }
    }, [auth.isAuthenticated, requireAuth, location.pathname]);

    const handleShowSignIn = async () => {
        await auth.showSignInDialog();
    }

    const handleShowSignUp = async () => {
        await auth.showSignUpDialog();
    }

    const handleProfileClick = () => {
        console.log('profile click', auth.isAuthenticated);
        if (!auth.isAuthenticated) {
            return handleShowSignIn();
        }

        navigate('/profile');
    }

    if (!auth.isAuthenticated && requireAuth && (!location.pathname.includes('/login') || !location.pathname.includes('/register'))) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <>
            {auth.showSignIn && <SignInDialog />}
            {auth.showSignUp && <SignUpDialog />}
            <div className='container-fluid px-0 mx-0 bg-white '>
                <div className="col-lg-12 px-0 text-white text-center">
                    <img src={top} width="100%" />
                </div>
                <Navbar onSignIn={handleShowSignIn} onProfile={handleProfileClick} />

                <div className="container-fluid">
                    <div className="row">
                        {/* <div className="col-1-5 px-0 d-none d-lg-block text-white text-center d-md-none"
                            style={{
                                backgroundSize: "auto", backgroundPosition: "right top",
                                backgroundImage: "",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                        </div> */}

                        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12"
                            style={{ backgroundColor: '#fff', minHeight: "500px" }}>
                            <AuthStatus />
                            <Outlet />
                        </div>

                        {/* <div className="col-1-5 px-0 d-none d-lg-block text-white text-center d-md-none"
                            style={{
                                backgroundSize: "auto",
                                backgroundImage: "",
                                backgroundRepeat: "no-repeat"
                            }}>
                        </div> */}
                    </div>
                </div>

                <Footer />
            </div>
        </>
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
