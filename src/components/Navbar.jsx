import { Link, useNavigate } from 'react-router-dom'
import { HiSearch, HiPlus, HiUser } from 'react-icons/hi'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
            <span className="text-yellow-300 font-black text-sm">E</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Eyvan</span>
        </Link>

        <div className="flex-1 max-w-lg hidden md:flex">
          <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <div className="flex items-center px-3 text-gray-400">
              <HiSearch size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/businesses?q=${search}`)}
              placeholder="رستوران، دکتر، وکیل..."
              className="flex-1 px-2 py-2.5 text-sm outline-none bg-transparent"
            />
            <button
              onClick={() => navigate(`/businesses?q=${search}`)}
              className="text-white px-5 text-sm font-semibold transition-colors"
              style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
            >
              جستجو
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mr-auto">
          <Link to="/businesses" className="hidden md:block text-sm text-gray-600 hover:text-purple-700 font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
            کسب‌وکارها
          </Link>
          {user ? (
            <>
              <Link
                to="/add-business"
                className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
              >
                <HiPlus size={16} />
                ثبت کسب‌وکار
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50">
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-white px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
            >
              <HiUser size={16} />
              ورود
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
