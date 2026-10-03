import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, FileText, MessageSquare, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const result = await res.json();
        
        if (!res.ok) throw new Error(result.message || 'Failed to fetch admin data');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post (Admin Action)?')) return;
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      // Refresh UI locally
      setData(prev => ({
        ...prev,
        posts: prev.posts.filter(p => p._id !== postId),
        stats: { ...prev.stats, totalPosts: prev.stats.totalPosts - 1 }
      }));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Loading admin dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage users and content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Users className="h-7 w-7" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-4 rounded-2xl text-purple-600"><FileText className="h-7 w-7" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Posts</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.totalPosts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-pink-100 p-4 rounded-2xl text-pink-600"><MessageSquare className="h-7 w-7" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Comments</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.totalComments}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manage Posts */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="h-5 w-5 text-gray-400" /> Manage Posts</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {data.posts.map(post => (
              <div key={post._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate pr-4 text-sm">
                    <span className={post.isDeleted ? "line-through text-gray-400" : ""}>{post.title}</span>
                    {post.isDeleted && <span className="ml-2 text-[10px] uppercase font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Deleted</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                {!post.isDeleted && (
                  <button onClick={() => handleDeletePost(post._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manage Users */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="h-5 w-5 text-gray-400" /> Manage Users</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {data.users.map(u => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    {u.name}
                    {u.role === 'admin' && <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full tracking-wide">Admin</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{u.email}</p>
                </div>
                <div className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-lg border border-gray-100">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
