import { fetchArticles } from '../api/articles';
import { useState,useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import moment from 'moment';
import { Link } from 'react-router-dom';
const handleDragStart = (e) => e.preventDefault();

const News = ()=>{
    
    const [articles,setArticles] = useState();
    const fetchArticle = async ()=>{
        const _articles = await fetchArticles({'sub': true});
        if(_articles!=null){
        setArticles(_articles);
        console.log(articles);

        }
    }
    moment.locale('ru');
    var items = [];
    articles != null || articles != undefined || articles?.length > 0  ?
        <>
        {articles.map((article)=>
        items.push(
        <div className='col-xl-12'>
            <div className='border px-2 py-2 rounded'>
            <div className='rounded' style={{backgroundImage:"url("+article.image+")",backgroundSize:"cover",height:"150px"}} 
            onDragStart={handleDragStart}></div>
            <p className='text-center mt-2' style={{fontSize:"12pt"}}>
                <Link style={{color: "rgb(9, 72, 130)"}} to={'/article/'+article.id}>{article.title}</Link></p>
            <p className='text-muted' style={{fontSize:"10pt"}}><i class="far fa-clock"></i>&nbsp;
             {moment(article.created_at, 'YYYYMMDD, h:mm:ss a,').calendar()}</p>
            </div>
        </div>)
        )}
        </>:<></>            
    useEffect(() => {
        fetchArticle();
    }, []);
    return(
        <>
            <div className="col-xl-12 my-3">
            <h6 className='px-3 mb-3 text-muted' style={{fontSize:"18px"}}><Link to="/articles">Новости и статьи</Link></h6>
            <AliceCarousel 
            mouseTracking 
            items={items} 
            ArrowLeft={true} 
            ArrowRight={true}
            disableDotsControls
            // renderPrevButton={() => {
            //     return <div className='bg-dark rounded-circle arrowLeft' >
            //         <i class="fa-solid fa-circle-left text-white fa-2x"></i></div>
            //   }}
            //   renderNextButton={() => {
            //     return <div className="position-absolute top-0 end-0">Next Item</div>
            //   }}
            responsive= {{
                0: {
                    items: 1,
                },
                1024: {
                    items: 3
                },
                1280: {
                    items: 5
                },
                1920: {
                    items: 8
                }
              }}    
            />
            </div>
        </>

    )
}
export default News;