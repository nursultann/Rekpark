import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { setArticleDetails } from "../../../redux/actions/product_actions";
import { fetchArticle, fetchArticles } from "../../../api/articles";

const ArticleDetailPage = () => {
    const dispatch = useDispatch();
    const [article, setArticle] = useState(null);
    const [articles, setArticles] = useState([]);
    const [update, setUpdate] = useState('');
    const params = useParams();

    const getArticle = async () => {
        try {
            const articleDetails = await fetchArticle(params.id);
            if (articleDetails) {
                dispatch(setArticleDetails(articleDetails));
                setArticle(articleDetails);
                moment.locale('ru');
                setUpdate(moment(articleDetails.created_at, 'YYYYMMDD, h:mm:ss a').calendar());
            }
        } catch (error) {
            console.error("Failed to fetch article:", error);
        }
    };

    const getArticles = async () => {
        try {
            const fetchedArticles = await fetchArticles({ 'limit': 10, 'offset': 0 });
            if (fetchedArticles) {
                setArticles(fetchedArticles);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        }
    };

    useEffect(() => {
        getArticle();
        getArticles();
    }, [params.id]);

    if (!article) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container px-0 py-8" style={{maxWidth : '100%'}}>
            <div className="grid md:grid-cols-12 gap-6">
                {/* Main Article Content */}
                <div className="md:col-span-8">
                    <div className="bg-white shadow-md rounded-xl overflow-hidden">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-96 object-cover"
                        />
                        
                        <div className="p-6">
                            <div className="flex items-center text-gray-500 mb-4 space-x-4">
                                <span>📅 Дата публикации: {update}</span>
                                <span>❤️ Нравится: {article.likes_count}</span>
                            </div>
                            
                            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                            
                            <div 
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: article.text }}
                            />
                        </div>
                    </div>
                </div>

                {/* Related Articles Sidebar */}
                <div className="md:col-span-4">
                    <h2 className="text-2xl font-semibold mb-4">Другие новости</h2>
                    
                    <div className="space-y-4">
                        {articles.map((relatedArticle) => (
                            <Link 
                                key={relatedArticle.id} 
                                to={`/article/${relatedArticle.id}`} 
                                className="block hover:bg-gray-100 transition-colors rounded-lg"
                            >
                                <div className="flex space-x-4">
                                    <img 
                                        src={relatedArticle.image} 
                                        alt={relatedArticle.title} 
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <h3 className="font-medium line-clamp-2">
                                            {relatedArticle.title}
                                        </h3>
                                        <p 
                                            className="text-gray-500 text-sm line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: relatedArticle.text }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;