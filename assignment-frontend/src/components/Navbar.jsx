import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { PenSquare, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-all duration-300">
              <PenSquare className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">BlogSpace</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 font-medium hidden sm:block">
                  Hi, {user.name}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition">
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => dispatch(logoutUser())}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 transition">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link to="/register" className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
