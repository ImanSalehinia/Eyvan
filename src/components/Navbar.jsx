import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-red-600">
          Eyvan
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/businesses" className="text-gray-600 hover:text-red-600 text-sm font-medium">
            کسب‌وکارها
          </Link>
          {user ? (
            <>
              <Link
                to="/add-business"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                ثبت کسب‌وکار
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 text-sm"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
