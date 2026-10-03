import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">BlogSpace</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Read, write, and share your thoughts with the world. A beautiful, simple, and clean blogging experience.
        </p>
        
        {user && (
          <Link to="/create-post" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transition-all">
            <Plus className="h-5 w-5" />
            Write a new Post
          </Link>
        )}
      </div>
      
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse mt-4"></div>
              <div className="h-4 bg-gray-100 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium text-gray-700">{post.author?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No posts found. Be the first to write one!
          </div>
        )}
      </div>
    </div>
  );
}
