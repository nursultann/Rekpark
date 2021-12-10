import React from "react";

const Footer  = ()=>{
    return(
        <div class="text-center text-white py-3" style={{backgroundColor:'#000fa6'}}>
            <div class="row">
                <div className="col-md-4"></div>  
                <div className="col-md-4">
                <p>Ош Парк <script type="text/javascript">document.write(new Date().getFullYear());</script></p>
                </div>
                <div className="col-md-4">
                    Мы в социальных сетях<br/>
                    <a href="">Instagram</a>
                </div>
            </div>
        </div>
    );
}
export default Footer;