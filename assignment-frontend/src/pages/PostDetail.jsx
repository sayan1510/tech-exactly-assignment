import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Trash2, Edit, MessageSquare, Send } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch Post
        const resPost = await fetch(`http://localhost:5000/api/posts/slug/${slug}`);
        const postData = await resPost.json();
        
        if (!resPost.ok) throw new Error(postData.message || 'Post not found');
        setPost(postData);

        // Fetch Comments
        const resComments = await fetch(`http://localhost:5000/api/comments/post/${postData._id}`);
        if (resComments.ok) {
          const commentsData = await resComments.json();
          setComments(commentsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [slug]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) navigate('/');
      else alert((await res.json()).message);
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ content: newComment, postId: post._id })
      });
      
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setNewComment('');
      } else {
        alert(data.message || 'Error adding comment');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center text-red-500">
      <h2 className="text-2xl font-bold mb-4">Error</h2>
      <p>{error}</p>
      <Link to="/" className="text-purple-600 hover:underline mt-4 inline-block">Return Home</Link>
    </div>
  );

  const canEditOrDelete = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </button>

      <article className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <User className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-gray-700">{post.author?.name || 'Unknown User'}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-gray-700">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div className="prose prose-lg prose-purple max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {canEditOrDelete && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button onClick={handleDeletePost} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer">
              <Trash2 className="h-4 w-4" /> Delete Post
            </button>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="mt-12 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-purple-600" /> 
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} className="mb-10">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all resize-none pr-16"
                rows="3"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="absolute right-3 bottom-4 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-600">
              <Link to="/login" className="text-purple-600 font-semibold hover:underline">Log in</Link> to join the conversation.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900">{comment.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{comment.content}</p>
                
                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-500 italic py-4">No comments yet. Be the first!</p>
          )}
        </div>
      </section>
    </div>
  );
}
