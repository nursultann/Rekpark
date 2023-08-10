
const MobileBar = ()=>{
    return(
        <>
        <div className="col-12 bg-white fixed-bottom d-block d-md-none">
            <div className="row d-flex justify-content-around py-3 rounded-lg">
                <a href="/"><i className="fa-solid fa-house text-primary"></i></a>
                <a href="/search_result/text"><i className="fa-solid fa-magnifying-glass text-primary"></i></a>
                <a href="/products/create"><i className="fa-regular fa-square-plus text-primary"></i></a>
                <a href="/favorites"><i className="fa-solid fa-star text-primary"></i></a>
                <a href="/profile"><i className="fa-solid fa-user text-primary"></i></a>
            </div>
        </div>
        
        </>
    )
}
export default MobileBar;