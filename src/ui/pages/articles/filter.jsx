import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchArticleCategories, fetchArticlesByCategories } from "../../../api/articles";

const ArticlesFilterPage = ({ match }) => {
    const [articles, setArticles] = useState();
    const [categories, setCategories] = useState();

    const fetchArticles = async () => {
        const _articles = await fetchArticlesByCategories(match.params.id);
        if (_articles != null) {
            setArticles(_articles.articles);
        }
    }

    const fetchCategories = async () => {
        const fetchCategory = await fetchArticleCategories();
        if (fetchCategory != null) {
            setCategories(fetchCategory);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchArticles();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Статьи и новости</h1>
                    <div className="mt-4">
                        <h2 className="inline-block px-4 py-2 text-lg font-medium bg-gray-100 text-gray-800 rounded-full">
                            Категории
                        </h2>
                    </div>
                </div>

                {/* Categories with horizontal scroll */}
                <div className="w-full py-2 rounded overflow-x-auto">
                    {categories != null &&
                        <nav className="flex space-x-2 min-w-max">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/articles_categories/${category.id}`}
                                    className="
                                                                    px-3 py-1 
                                                                    text-sm 
                                                                    text-gray-700 
                                                                    bg-gray-100 
                                                                    rounded-full 
                                                                    hover:bg-gray-200 
                                                                    transition-colors 
                                                                    whitespace-nowrap
                                                                    inline-block
                                                                    "
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    }
                </div>

                {/* Articles */}
                <div className="space-y-6">
                    {articles ? (
                        articles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/article/${article.id}`}
                                className="block group"
                            >
                                <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/3 lg:w-1/4">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-48 md:h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="md:w-2/3 lg:w-3/4 space-y-3">
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <div
                                                className="text-gray-600 line-clamp-4"
                                                dangerouslySetInnerHTML={{
                                                    __html: article.text
                                                }}
                                            />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg text-gray-600">
                                Загрузка...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArticlesFilterPage;