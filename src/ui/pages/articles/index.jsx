import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { fetchArticleCategories, fetchArticles } from "../../../api/articles";
import Navbar from "../../components/navbar";
import { maxSymbolEllipsis } from "../../../helpers/functions";

const ArticleListPage = () => {
    const [articles, setArticles] = useState();
    const [categories, setCategories] = useState();

    const fetchArticle = async () => {
        const _articles = await fetchArticles({ 'sub': true });
        if (_articles != null) {
            setArticles(_articles);
            console.log(_articles)
        }
    }

    const fetchCategories = async () => {
        const fetchCategory = await fetchArticleCategories();
        if (fetchCategory != null) {
            setCategories(fetchCategory);
            console.log(fetchCategory)
        }
    }

    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, []);

    return (
        <div className="col-12">
            <div className="row px-1">
                <div className="col-md-12">
                    <div className="col-md-12">
                        <label style={{ fontSize: 24 }} className="pt-3">Статьи и новости</label>
                        <hr />
                    </div>
                    <div className="col-xl-12">
                        <label style={{ fontSize: 18 }} className="text-dark bg-light py-2 px-2 rounded-pill" >Категории</label>
                        <div className="container-fluid">
                            <div className="col-xl-12 py-2 rounded nav-scroller mb-2">
                                <nav className="nav d-flex justify-content-between">
                                    {categories != null || categories != undefined || categories?.length > 0 ?
                                        <>
                                            {categories.map((category) =>
                                                <Link className="p-2" to={"/articles_categories/" + category.id}>{category.name}</Link>
                                            )
                                            }
                                        </>
                                        :
                                        <></>
                                    }
                                </nav>
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
            <div className="row px-3 pb-4 mt-3">
                {articles != null || articles != undefined || articles?.length > 0 ?
                    <>
                        {articles.map((article) =>

                            <div className="col-6 col-md-3 px-2 pb-3">
                                <div className="col-12 border rounded-lg shadow-sm" style={{height:380}}>
                                    <div className="col-md-12 p-2">
                                        <img src={article.image} width="100%" className="rounded" />
                                    </div>
                                    <Link className="nav-link" to={'/article/' + article.id}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label style={{ fontSize: 20 }} className="text-dark">{article.title}</label>
                                                <div className="text-muted pb-2" style={{
                                                    // display: "-webkit-box",
                                                    // webkitLineClamp: "2",
                                                    // webkitBoxOrient: "vertical",
                                                    // overflow: "hidden",
                                                    // textOverflow: 'ellipsis',
                                                    // whiteSpace:'nowrap'
                                                }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: maxSymbolEllipsis(article.text, 50)
                                                    }}>
                                                </div>
                                                <label className="text-muted pt-2"><i className="far fa-clock"></i> {moment(article.created_at, 'YYYYMMDD, H:mm:ss').fromNow()}</label>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                    : <>Загрузка</>
                }
            </div>
        </div>
    );
}

export default ArticleListPage;