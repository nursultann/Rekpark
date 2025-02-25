import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useArticlesQuery } from "../../../hooks/article";
import { useUserStore } from "../../../store/user_store";
import { 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  Heart, 
  ChevronLeft, 
  MessageSquare, 
  Send,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import moment from "moment";

// Comment component
const Comment = ({ comment, onReply, onDelete, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  
  const isAuthor = currentUserId && comment.user?.id === currentUserId;
  
  const handleSubmitEdit = () => {
    if (editText.trim()) {
      onUpdate(comment.id, editText);
      setIsEditing(false);
    }
  };
  
  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };
  
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {comment.user?.avatar ? (
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name || "User"} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              {(comment.user?.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium">{comment.user?.name || "Anonymous"}</div>
            <div className="text-xs text-gray-500">
              {moment(comment.created_at).fromNow()}
            </div>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[80px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button 
                  onClick={handleSubmitEdit}
                  className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 mb-2">{comment.text}</div>
          )}
          
          {!isEditing && (
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button 
                className="flex items-center gap-1 hover:text-primary"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageSquare className="w-4 h-4" />
                Ответить
              </button>
              
              {isAuthor && (
                <>
                  <button 
                    className="flex items-center gap-1 hover:text-blue-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-red-600"
                    onClick={() => onDelete(comment.id)}
                  >
                    Удалить
                  </button>
                </>
              )}
              
              <div className="flex items-center gap-2 ml-auto">
                <button className="hover:text-green-600">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <span>{comment.likes || 0}</span>
                <button className="hover:text-red-600">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {showReplyForm && (
            <div className="mt-3">
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напишите ответ..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[60px]"
                />
                <button 
                  onClick={handleSubmitReply}
                  className="px-3 py-1 h-10 bg-primary text-white rounded-lg hover:bg-primary/90 self-end"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 pl-3 border-l-2 border-gray-100">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Related articles component
const RelatedArticles = ({ articles, currentArticleId }) => {
  const filteredArticles = articles.filter(
    article => article.id !== currentArticleId
  ).slice(0, 3);
  
  if (filteredArticles.length === 0) return null;
  
  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-semibold mb-4">Похожие статьи</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredArticles.map(article => (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`}
            className="group"
          >
            <div className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-all">
              <div className="aspect-[16/9] overflow-hidden">
                {article.thumbnail_url ? (
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Нет изображения</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="text-xs text-gray-500">
                  {moment(article.created_at).format("DD.MM.YYYY")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main component
const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, showSignInDialog } = useUserStore();
  
  const {
    articles,
    selectedArticle,
    loading,
    error,
    fetchArticleDetails,
    toggleFavorite,
    addComment,
    updateComment,
    deleteComment
  } = useArticlesQuery();
  
  const [commentText, setCommentText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch article details when ID changes
  useEffect(() => {
    if (id) {
      fetchArticleDetails(id);
    }
  }, [id, fetchArticleDetails]);
  
  // Update favorite state
  useEffect(() => {
    if (selectedArticle) {
      setIsFavorite(selectedArticle.is_favorite || false);
    }
  }, [selectedArticle]);
  
  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      showSignInDialog();
      return;
    }
    
    if (commentText.trim()) {
      try {
        await addComment(id, { text: commentText });
        setCommentText("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };
  
  // Handle comment reply
  const handleReplyComment = async (parentId, text) => {
    if (!isAuthenticated) {
      showSignInDialog();
      return;
    }
    
    try {
      await addComment(id, { text, parent_id: parentId });
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };
  
  // Handle toggling favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      showSignInDialog();
      return;
    }
    
    try {
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };
  
  // Format article content
  const renderContent = useCallback(() => {
    if (!selectedArticle?.content) return null;
    
    return (
      <div 
        className="prose prose-lg max-w-none prose-img:rounded-lg prose-headings:text-gray-900 prose-p:text-gray-700"
        dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
      />
    );
  }, [selectedArticle]);
  
  if (loading && !selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 mb-8 rounded"></div>
          
          <div className="aspect-[16/9] bg-gray-200 rounded-xl mb-8"></div>
          
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки статьи</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }
  
  if (!selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Статья не найдена</h2>
          <p className="text-gray-600 mb-6">Запрошенная статья не существует или была удалена.</p>
          <Link 
            to="/articles"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Все статьи
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Назад к списку
          </button>
        </div>
        
        {/* Article header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {selectedArticle.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
            {selectedArticle.category && (
              <Link 
                to={`/articles?category=${selectedArticle.category.id}`}
                className="text-primary hover:underline"
              >
                {selectedArticle.category.name}
              </Link>
            )}
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {moment(selectedArticle.created_at).format("DD MMMM YYYY")}
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {selectedArticle.read_time || '5 мин'} чтения
            </div>
            
            {selectedArticle.author && (
              <div>
                Автор: <span className="font-medium">{selectedArticle.author.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured image */}
        {selectedArticle.thumbnail_url && (
          <div className="mb-8">
            <img 
              src={selectedArticle.thumbnail_url} 
              alt={selectedArticle.title}
              className="w-full h-auto object-cover rounded-xl max-h-[500px]"
            />
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between mb-8 border-y border-gray-100 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-primary' : ''}`} />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
            
            <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100">
              <Heart className="w-5 h-5" />
              {selectedArticle.likes_count || 0}
            </button>
          </div>
          
          <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100">
            <Share2 className="w-5 h-5" />
            Поделиться
          </button>
        </div>
        
        {/* Article content */}
        <div className="mb-12">
          {renderContent()}
        </div>
        
        {/* Comments section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Комментарии ({selectedArticle.comments?.length || 0})
          </h3>
          
          {/* Comment form */}
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Напишите ваш комментарий..." : "Войдите, чтобы оставить комментарий"}
              disabled={!isAuthenticated}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[100px]"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                {!isAuthenticated && (
                  <button 
                    onClick={showSignInDialog}
                    className="text-primary hover:underline"
                  >
                    Войдите
                  </button>
                )} 
                {isAuthenticated && user && (
                  <span>Комментировать как <span className="font-medium">{user.name}</span></span>
                )}
              </div>
              <button 
                onClick={handleSubmitComment}
                disabled={!isAuthenticated || !commentText.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить
              </button>
            </div>
          </div>
          
          {/* Comments list */}
          <div className="space-y-6">
            {selectedArticle.comments?.length ? (
              selectedArticle.comments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReplyComment}
                  onDelete={deleteComment.bind(null, id)}
                  onUpdate={updateComment.bind(null, id)}
                  currentUserId={user?.id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Пока нет комментариев. Будьте первым!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Related articles */}
        <RelatedArticles 
          articles={articles || []} 
          currentArticleId={selectedArticle.id}
        />
      </div>
    </div>
  );
};

export default ArticleDetailPage;