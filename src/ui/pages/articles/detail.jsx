import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { setArticleDetails } from "../../../redux/actions/product_actions";
import { fetchArticle, fetchArticles } from "../../../api/articles";
import Navbar from "../../components/navbar";
const ArticleDetailPage = (props) => {
    const dispatch = useDispatch();
    // const { articleDetails } = useSelector((state) => state.product);
    const [article, setArticle] = useState();
    const [articles, setArticles] = useState();
    const [update, setUpdate] = useState();
    const params = useParams();
    const getArticle = async () => {
        const articleDetails = await fetchArticle(params.id);
        if (articleDetails != null) {
            dispatch(setArticleDetails(articleDetails));
            setArticle(articleDetails);
            const time = moment(articleDetails.created_at, 'YYYYMMDD, h:mm:ss a');
            moment.locale('ru');
            setUpdate(time.calendar());
        }
    }
    const getArticles = async () => {
        const Articles = await fetchArticles({ 'limit': 10, 'offset': 0 });
        if (Articles != null) {
            setArticles(Articles);
            console.log(articles);
        }
    }
    useEffect(() => {
        getArticle();
        getArticles();
    }, []);
    return (
        <div>
            <div className="col-md-12 pt-3 mb-5">
                <div className="row py-1 px-2">
                    <div className="col-md-8">
                        {article != null ?
                            <div className="w-full object-cover rounded-xl transition-all duration-300">
                                <img src={article.image} width="100%" className="rounded" />
                                <label className="text-muted pt-3">Дата публикации: {update}</label>
                                <br />
                                <label htmlFor="">Нравится: {article.likes_count}</label>
                                <br />
                                <label style={{ fontSize: 24 }}>{article.title}</label>
                                <p dangerouslySetInnerHTML={{
                                    __html: article.text
                                }}></p>
                            </div>
                            : 
                            <div className="col-12 text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Загрузка...</span>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="col-md-4">
                        <div className="col-md-12">
                            <label className="" style={{ fontSize: 20 }}>
                                Другие новости
                            </label>
                        </div>
                        {articles != null ?
                            <>
                                {
                                    articles.map((article) =>
                                        <>
                                            <a className="nav-link" href={"/article/" + article.id}>
                                                <div className="col-md-12 object-cover">
                                                    <div className="row">
                                                        <div className="col-md-5 px-1">
                                                            <img src={article.image} width="100%" className="rounded" />
                                                        </div>
                                                        <div className="col-md-7 px-0">
                                                            <label>{article.title}</label>
                                                            <p
                                                                className="text-muted"
                                                                style={{
                                                                    display: "-webkit-box",
                                                                    webkitLineClamp: "3",
                                                                    webkitBoxOrient: "vertical",
                                                                    overflow: "hidden"
                                                                }}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: article.text
                                                                }}
                                                            >
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            </a>
                                        </>
                                    )}
                            </> : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ArticleDetailPage;