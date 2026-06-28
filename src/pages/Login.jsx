import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
        setLoading(false)
        return
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          role,
        })
      }

      if (role === 'business_owner') {
        navigate('/add-business')
      } else {
        navigate('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: 'ایمیل یا رمز عبور اشتباهه' })
        setLoading(false)
        return
      }
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          {isRegister ? 'ثبت‌نام' : 'ورود'}
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          {isRegister ? 'حساب جدید بساز' : 'به ایوان خوش اومدی'}
        </p>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="نام و نام خانوادگی"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع حساب</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${role === 'user' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className="text-2xl mb-1">👤</p>
                    <p className="text-sm font-medium text-gray-700">کاربر عادی</p>
                    <p className="text-xs text-gray-400 mt-0.5">جستجو و نظر</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('business_owner')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${role === 'business_owner' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className="text-2xl mb-1">🏪</p>
                    <p className="text-sm font-medium text-gray-700">صاحب کسب‌وکار</p>
                    <p className="text-xs text-gray-400 mt-0.5">ثبت و مدیریت</p>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="حداقل ۶ کاراکتر"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'لطفاً صبر کن...' : isRegister ? 'ثبت‌نام' : 'ورود'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'قبلاً حساب داری؟' : 'حساب نداری؟'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setMessage(null) }}
            className="text-red-600 font-medium"
          >
            {isRegister ? 'وارد شو' : 'ثبت‌نام کن'}
          </button>
        </p>
      </div>
    </div>
  )
}
