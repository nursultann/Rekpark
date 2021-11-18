import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {firebase, auth} from "../config/firebase_config";
import * as firebaseui from "firebaseui";

const Register = () => {
    // Inputs
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState('');
    const [showValidation, setShowValidation] = useState(false);
    const [final, setFinal] = useState('');

    console.log('log');

    const signIn = () => {
        if (phoneNumber === "" || phoneNumber.length < 9) return;
        auth.signInWithPhoneNumber(`+${phoneNumber}`, window.verify).then((result) => {
            setFinal(result);
            alert("code sent")
            setShowValidation(true);
        }).catch((err) => {
                alert(err);
                window.location.reload()
            });
    };

    const validateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            alert("success");
            // result.user.uuid;
            console.log('success ', result);
        }).catch((err) => {
            alert("Wrong code");
        })
    }

    useEffect(() => {
        window.verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.verify.render();
    }, []);

    return(
        <div>
            <Navbar/>
            <div style={{}}>
                <center>
                    <div style={{ display: !showValidation ? "block" : "none" }}>
                        <input value={phoneNumber} onChange={(e) => { 
                        setPhoneNumber(e.target.value) }}
                            placeholder="phone number" />
                        <br /><br />
                        <div id="recaptcha-container"></div>
                        <button onClick={signIn}>Send OTP</button>
                    </div>
                    <div style={{ display: showValidation ? "block" : "none" }}>
                        <input type="text" placeholder={"Enter your OTP"}
                            onChange={(e) => { setOtp(e.target.value) }}></input>
                        <br /><br />
                        <button onClick={validateOtp}>Verify</button>
                    </div>
                </center>
            </div>
        </div>
    );
}

export default Register;