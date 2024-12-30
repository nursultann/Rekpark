import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { fetchArticleCategories, fetchArticles } from "../../../api/articles";
import { maxSymbolEllipsis } from "../../../helpers/functions";

const ArticleListPage = () => {
    const [articles, setArticles] = useState();
    const [categories, setCategories] = useState();

    const fetchArticle = async () => {
        const _articles = await fetchArticles({ 'sub': true });
        if (_articles != null) {
            setArticles(_articles);
        }
    }

    const fetchCategories = async () => {
        const fetchCategory = await fetchArticleCategories();
        if (fetchCategory != null) {
            setCategories(fetchCategory);
        }
    }

    useEffect(() => {
        fetchArticle();
        fetchCategories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Статьи и новости
                </h1>

                {/* Categories */}
                <div className="space-y-3">
                    <h2 className="inline-flex px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                        Категории
                    </h2>
                    <div className="overflow-x-auto">
                        <nav className="flex space-x-3 min-w-max pb-2">
                            {categories?.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/articles_categories/${category.id}`}
                                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            {articles ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {articles.map((article) => (
                        <Link 
                            key={article.id}
                            to={`/article/${article.id}`}
                            className="group no-underline"
                        >
                            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                                {/* Image */}
                                <div className="relative pt-[60%]">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow p-4 space-y-3">
                                    <h3 className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    
                                    <div
                                        className="text-gray-600 text-sm line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                            __html: maxSymbolEllipsis(article.text, 50)
                                        }}
                                    />

                                    <div className="flex items-center text-gray-500 text-sm mt-auto pt-3">
                                        <i className="far fa-clock mr-2" />
                                        {moment(article.created_at, 'YYYYMMDD, H:mm:ss').fromNow()}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center py-12">
                    <div className="text-lg text-gray-600">
                        Загрузка...
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArticleListPage;