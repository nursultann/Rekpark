import React,{useState,useEffect} from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { fetchArticleCategories, fetchArticles } from "../api/articles";
import $ from 'jquery';
const Articles = () =>{
    const [articles,setArticles] = useState();
    const [categories,setCategories] = useState();
    const fetchArticle = async ()=>{
        const _articles = await fetchArticles({'sub': true});
        if(_articles!=null){
        setArticles(_articles);
        }
    }
    const fetchCategories = async ()=>{
        const fetchCategory = await fetchArticleCategories();
        if(fetchCategory!=null){
            setCategories(fetchCategory);
        }
    }
    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, []);
        return(
            <div>
            <Navbar/>
            <div className="col-xl-12 mt-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a className="text-primary" href="/"><i class="fa-solid fa-house"></i> Главная страница</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Статьи и новости</li>
                </ol>
            </nav>
            </div>
            <div className="row px-2">
            <div className="col-md-10">
               <div className="col-md-12">
                   <label style={{fontSize:28}} className="pt-1">Статьи и новости</label>
                    <hr/>
               </div>
               <div className="col-xl-12">
                   <label style={{fontSize:18}} className="text-dark bg-light py-2 px-2 rounded-pill" >Категории</label>
                   <div className="col-xl-12 d-flex justify-content-around bg-light py-2 rounded-pill">
                   {categories != null || categories != undefined || categories?.length > 0 ?
                   <>
                   {categories.map((category)=> 
                   <a className="cat-link" href={"articles/"+category.id}>{category.name}</a>
                   )
                   }
                   </>
                    :
                    <></>
                   }
                   </div>
                <hr/>
               </div>
               {articles != null || articles != undefined || articles?.length > 0  ?
               <>
               {articles.map((article)=>
               <a class="nav-link" href="/article">
                <div className="col-md-12 shadow px-3 py-3">
                    <div className="row">
                        <div className="col-md-3">
                        <img src="https://www.cnet.com/a/img/-qQkzFVyOPEoBRS7K5kKS0GFDvk=/940x0/2020/04/16/7d6d8ed2-e10c-4f91-b2dd-74fae951c6d8/bazaart-edit-app.jpg" width="100%" class="rounded"/>
                        </div>
                        <div className="col-md-9">
                        <label style={{fontSize:20}} className="text-dark">{article.title}</label>
                        <div style={{display: "-webkit-box",
                                        webkitLineClamp: "10",
                                        webkitBoxOrient: "vertical",
                                        overflow: "hidden"}} 
                            dangerouslySetInnerHTML={{
                                            __html: article.text
                                          }}>
                        </div>
                        </div>
                    </div>
                <hr/>    
                </div>
                </a>
               )}
                </>
                :<>Загрузка</>
                }            
            </div>
            <div className="col-md-2">

            </div>
            </div>
            </div>
        );
}
export default Articles;