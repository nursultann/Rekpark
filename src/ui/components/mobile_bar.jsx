import { Link } from "react-router-dom";

const MobileBar = () => {
    return (
        <>
            <div className="col-12 bg-white fixed-bottom d-block d-md-none">
                <div className="row d-flex justify-content-around py-3 rounded-lg">
                    <Link to="/"><i className="fa-solid fa-house text-primary"></i></Link>
                    <Link to="/search-result"><i className="fa-solid fa-magnifying-glass text-primary"></i></Link>
                    <Link to="/products/create"><i className="fa-regular fa-square-plus text-primary"></i></Link>
                    <Link to="/favorites"><i className="fa-solid fa-star text-primary"></i></Link>
                    <Link to="/profile"><i className="fa-solid fa-user text-primary"></i></Link>
                </div>
            </div>

        </>
    )
}
export default MobileBar;